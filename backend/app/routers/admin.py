import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.schemas.admin import (
    BulkResponseIdOut, AdminToken, AIResponseItemInfo, AIResponseActionSet, 
    AIResponseTaggingSet, DraftResponse
)
from app.models.item import Item
from app.models.tag import Tag
import app.core.openai_utils as ai_utils
from app.schemas.item import ItemCreate
from app.schemas.transaction import TransactionCreate
from app.core.ai_client import run_create_items

router = APIRouter(prefix='/admin', tags=['admin'])

@router.post('/embedding-item', response_model=BulkResponseIdOut)
def embedding_item(
    admin_token: AdminToken,
    db: Session = Depends(get_db),
):
    if admin_token.token != 'your_admin_token_here':  # TODO: Replace with actual admin token validation
        return BulkResponseIdOut(success=[], failed=[], info='No items to embedding')
    item_needs_embedding = Item.active(db).filter(Item.embedding.is_(None)).all()
    if len(item_needs_embedding) == 0:
        return BulkResponseIdOut(success=[], failed=[], info='No items to embedding')
    item_strs = [item.get_embedding_text() for item in item_needs_embedding]
    embedding_vecs = ai_utils.get_embeddings(item_strs)
    for item, embedding in zip(item_needs_embedding, embedding_vecs):
        item.embedding = embedding
    db.commit()
    return BulkResponseIdOut(success=[str(item.id) for item in item_needs_embedding], failed=[])

@router.post('/embedding-tag', response_model=BulkResponseIdOut)
def embedding_tag(
    admin_token: AdminToken,
    db: Session = Depends(get_db),
):
    if admin_token.token != 'your_admin_token_here':
        return BulkResponseIdOut(success=[], failed=[], info='No tags to embedding')
    tag_needs_embedding = db.query(Tag).filter(Tag.embedding.is_(None)).all()
    if len(tag_needs_embedding) == 0:
        return BulkResponseIdOut(success=[], failed=[], info='No tags to embedding')
    tag_strs = [tag.get_embedding_text() for tag in tag_needs_embedding]
    embedding_vecs = ai_utils.get_embeddings(tag_strs)
    for tag, embedding in zip(tag_needs_embedding, embedding_vecs):
        tag.embedding = embedding
    db.commit()
    return BulkResponseIdOut(success=[str(tag.id) for tag in tag_needs_embedding], failed=[])


@router.post('/test-query', response_model=DraftResponse)
def test_query_all_naive(
    admin_token: AdminToken,
    db: Session = Depends(get_db),
):
    if admin_token.token != 'your_admin_token_here':
        return ItemCreate(name='Unauthorized')
    
    # Example query to test the OpenAI embedding functionality
    query = admin_token.message.split('\n')
    query_id = 'ainew-202507261101'
    # Ask OpenAI for structured query response
    client = ai_utils.get_openai_client()
    response = client.chat.completions.parse(
        model='gpt-4o-mini',
        messages=[
            {
                'role': 'system',
                'content': 'You are an AI assistant that helps with inventory management. Please provide the structured information for the following query. Each line should represent an item with its details: name, unit, quantity, location (optional), and raw input text. Raw input text is the original query text line that the item was created from. Ignore the id field in the response, it is not needed.',
            },
            {
                'role': 'user',
                'content': '\n'.join(query)
            }
        ],
        response_format=AIResponseItemInfo
    )
    entry_item_dict = {}
    for item in response.choices[0].message.parsed.items:
        item.id = f'tmpId-{query_id}-{uuid.uuid4()}'
        entry_item_dict[item.id] = item
    
    # Embedding the items
    keys, values = zip(*entry_item_dict.items())
    embedding_vec_list = ai_utils.get_embeddings(
        [item.get_embedding_text() for item in values]
    )
    entry_vec_dict = dict(zip(keys, embedding_vec_list))

    # Find similar items based on embeddings
    unique_items = set()
    for embedding_vec in entry_vec_dict.values():
        similar_items = ai_utils.top_k_similar_items(
            Item.active(db),
            embedded_vec=embedding_vec,
            k=3
        )
        unique_items.update(similar_items)
    unique_items = list(unique_items)

    # Query AI for create and transaction actions
    database_query_content = '\n'.join([
        'Database Items:',
        *[
            f'[id: {item.id}, name: {item.name}, unit: {item.unit}, quantity: {item.quantity}, location: {item.location}]' 
            for item in unique_items
        ],
        'User input items:',
        *[
            f'[id: {item.id}, name: {item.name}, unit: {item.unit}, quantity: {item.quantity}, location: {item.location}]'
            for item in entry_item_dict.values()
        ]
    ])
    ai_response = client.chat.completions.parse(
        model='gpt-4o-mini',
        messages=[
            {
                'role': 'system',
                'content': (
                    'As an AI‐powered inventory assistant, you’ll receive two lists:'
                    '1. Database Items: existing records with [id, name, unit, quantity, location];'
                    '2. User input items: user entries with [id, name, unit, quantity, location].'
                    'Your tasks:'
                    'For each entry in item_list, perform a fuzzy name match against Database Items (e.g. match “full-cream milk” to “milk”) and consider location when provided (treat missing location as a wildcard).'
                    'If a suitable match is found, set action = "update", and let the existing_item_id be the matched item’s id.'
                    'If no match meets your criteria, set action = "create".'
                    'Always include the entry_id in the response.'
                    'Please strictly follow the AIResponseActionSet structure for your response.'
                ),
            },
            {
                'role': 'user',
                'content': database_query_content,
            },
        ],
        response_format=AIResponseActionSet
    )
    print(f'AI Response: {ai_response.choices[0].message.parsed}')

    # Process AI response
    actions = ai_response.choices[0].message.parsed.actions
    tmp2existing = { x.entry_id: (x.existing_item_id, x.quantity) for x in actions if x.action == "update" }
    item_to_create = [x for x in entry_item_dict.values() if x.id not in tmp2existing]

    # Generate tags
    unique_tags = set()
    for embedding_vec in entry_vec_dict.values():
        similar_tags = ai_utils.top_k_similar_tags(
            db.query(Tag),
            embedded_vec=embedding_vec,
            k=3
        )
        unique_tags.update(similar_tags)
    unique_tags = list(unique_tags)

    tag_query_system_content = (
        'As an AI-powered inventory assistant, you will receive two lists:',
        '1. Database Tags: existing tag records in the format [id, name];',
        '2. User input items: user-entered items in the format [id, name, unit, quantity, location].',
        'For each user input item, select the most appropriate tags (multiple tags allowed) based on common sense and semantics.',
        'You may use fuzzy matching (e.g., match "full-cream milk" to the "milk" tag) and your general knowledge about the items.',
        'Please strictly follow the AIResponseTaggingSet structure for your response.'
    )
    tag_query_content = '\n'.join([
        'Database Tags:',
        *[
            f'[id: {tag.id}, name: {tag.name}]'
            for tag in unique_tags
        ],
        'User input items:',
        *[
            f'[id: {item.id}, name: {item.name}, unit: {item.unit}, quantity: {item.quantity}, location: {item.location}]'
            for item in item_to_create
        ]
    ])
    ai_tagging_response = client.chat.completions.parse(
        model='gpt-4o-mini',
        messages=[
            {
                'role': 'system',
                'content': (
                    'As an AI‐powered inventory assistant, you’ll receive two lists:'
                    '1. Database Tags: existing records with [id, name];'
                    '2. User input items: user entries with [id, name, unit, quantity, location].'
                    'Your task:'
                    'For each entry in item_list, perform a fuzzy name match against Database Tags (e.g. match “full-cream milk” to “milk”).'
                    'If a suitable match is found, apply the tag to the item.'
                    'Please strictly follow the AIResponseTaggingSet structure for your response.'
                ),
            },
            {
                'role': 'user',
                'content': tag_query_content,
            },
        ],
        response_format=AIResponseTaggingSet
    )
    tagging_res = ai_tagging_response.choices[0].message.parsed.tagging
    tagging_dict = {x.entry_id: x.tag_ids for x in tagging_res}

    # Generate response
    response = DraftResponse(
        query_id=query_id,
        item_create=[],
        item_transaction=[]
    )
    for item in entry_item_dict.values():
        if item.id in tmp2existing:
            response.item_transaction.append(
                TransactionCreate(
                    item_id=int(tmp2existing[item.id][0]),
                    user_id=-1,
                    quantity=tmp2existing[item.id][1],
                    changeType="ADD" if tmp2existing[item.id][1] > 0 else "REMOVE",
                    raw_input=item.raw_input,
                )
            )
        else:
            response.item_create.append(
                ItemCreate(
                    id=item.id,
                    name=item.name,
                    unit=item.unit,
                    quantity=item.quantity,
                    location=item.location or None,
                    raw_input=item.raw_input,
                    tag_ids=tagging_dict.get(item.id, [])
                )
            )

    return response


@router.post('/test-query-structured', response_model=DraftResponse)
def test_query_structured(
    admin_token: AdminToken,
    db: Session = Depends(get_db),
):
    if admin_token.token != 'your_admin_token_here':
        return ItemCreate(name='Unauthorized')
    
    query = admin_token.message.split('\n')
    query_id = 'ainew-202507261101'
    user_id = -1

    return run_create_items(
        db=db,
        user_id=user_id,
        querys=query,
        query_id=query_id,
        id_prefix='tmpId-'
    )


# @router.post('/register', response_model=UserOut)
# def register(user: UserCreate, db: Session = Depends(get_db)):
#     db_user = get_user_by_email(db, email=user.email)
#     if db_user:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                             detail='Email already registered')
#     return create_user(db, user)

# @router.post('/login')
# def login(user: UserLogin, db: Session = Depends(get_db)):  # TODO: UserLogin
#     db_user = get_user_by_email(db, email=user.email)
#     if not db_user or not verify_password(user.password, db_user.password_hash):
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
#                             detail='Invalid credentials')
    
#     token = create_access_token(data={'sub': db_user.email})
#     return {'access_token': token, 'token_type': 'bearer'}

# @router.get('/', response_model=list[UserOut])
# def list_users(db: Session = Depends(get_db)):
#     return get_all_users(db)

# @router.get('/{user_id}', response_model=UserOut)
# def get_user_endpoint(user_id: int, db: Session = Depends(get_db)):
#     user = get_user(db, user_id)
#     if not user:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail='User not found')
#     return user

# @router.put('/{user_id}', response_model=UserOut)
# def update_user_endpoint(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
#     return update_user(db, user_id, user)

# @router.delete('/{user_id}')
# def delete_user_endpoint(user_id: int, db: Session = Depends(get_db)):
#     return delete_user(db, user_id)


# @router.get('/me', response_model=UserOut)
# def get_me(current_user: User = Depends(get_current_user)):
#     return current_user


# @router.get('/me/families', response_model=list[FamilyOut])
# def get_families_for_user(
#     db: Session = Depends(get_db), 
#     current_user: User = Depends(get_current_user)
# ):
#     families = get_user_family(db, current_user.id)
#     return families
