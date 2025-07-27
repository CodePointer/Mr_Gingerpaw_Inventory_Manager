from openai import OpenAI
from pydantic import BaseModel
from sqlalchemy.orm import Session, Query
import tiktoken
from app.core.config import settings
from app.models.item import Item
from app.models.tag import Tag
from app.schemas.ai_client import (
    EmbeddedVector, ParseItemSchema, ParseItemSchemaList,
    ReconcileItemSchema, ReconcileItemSchemaList,
    AssignTagsSchema, AssignTagsSchemaList
)
import uuid
from app.schemas.item import ItemCreate
from app.schemas.transaction import TransactionCreate
from app.schemas.admin import DraftResponse


class InventoryAIClient:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model_name = 'gpt-4o-mini'
        self.encoding = tiktoken.get_encoding('cl100k_base')
        self.db = None  # Placeholder for database session, set later

    def set_db(self, db: Session):
        '''Set the database session for the client.'''
        self.db = db

    def get_openai_client(self) -> OpenAI:
        '''Get the OpenAI client instance.'''
        if not self.client.api_key:
            raise ValueError('OpenAI API key is not set.')
        return self.client

    def count_tokens(self, text: str) -> int:
        '''Count the number of tokens in a given text.'''
        return len(self.encoding.encode(text))

    def assign_ids_with_prefix(
        self, lengths: int, prefix: str = ''
    ) -> list[str]:
        '''Assign a unique ID to each string in the list.'''
        return [f'{prefix}{str(uuid.uuid4())}' for _ in range(lengths)]

    def llm_parse_items(
        self, querys: list[str], prefix: str = ''
    ) -> dict[str, ParseItemSchema]:
        '''Parse items from a list of query strings with assigned IDs.'''
        content_system = (
            'You are an AI assistant that helps with inventory management.' 
            'Please provide the structured information for the following query.'
            'Each line should represent an item with its details:'
            'name, unit, quantity, location (optional), and raw input text.'
            'Raw input is the original query line the item was created from.'
        )
        content_user = '\n'.join(querys)
        llm_res = self._client_parse(
            content_system=content_system,
            content_user=content_user,
            response_format=ParseItemSchemaList
        )
        assigned_ids = self.assign_ids_with_prefix(len(querys), prefix)
        return dict(zip(assigned_ids, llm_res.response))

    def embedding_parse_items(
        self, parsed_items: dict[str, ParseItemSchema]
    ) -> dict[str, EmbeddedVector]:
        '''Get embeddings for parsed items.'''
        item_strings = [
            f'{item.name}|||{item.unit}|||{item.quantity}|||{item.location or ""}'
            for item in parsed_items.values()
        ]
        item_embeddings = self._get_embeddings(item_strings)
        return dict(zip(parsed_items.keys(), item_embeddings))

    def llm_reconcile_items(
        self, item_query: Query, parsed_items: dict[str, ParseItemSchema], embedded_items: dict[str, EmbeddedVector]
    ) -> dict[str, ReconcileItemSchema]:
        '''Reconcile parsed items with existing items in the database.'''
        similar_items = set()
        for embedded_vec in embedded_items.values():
            similar_items.update(
                self._top_k_similar_items(
                    item_query, embedded_vec, k=3
                )
            )
        content_system = (
            'As an AI‐powered inventory assistant, you’ll receive two lists:'
            '1. Database Items: existing records with [id, name, unit, quantity, location];'
            '2. User input items: user entries with [id, name, unit, quantity, location].'
            'Your tasks:'
            'For each entry in item_list, perform a fuzzy name match against Database Items (e.g. match “full-cream milk” to “milk”) and consider location when provided (treat missing location as a wildcard).'
            'If a suitable match is found, set action = "update", and let the existing_item_id be the matched item’s id.'
            'If no match meets your criteria, set action = "create".'
            'Always include the entry_id in the response.'
            'Please strictly follow the AIResponseActionSet structure for your response.'
        )
        content_user = '\n'.join([
            'Database Items:',
            *[
                f'[id: {item.id}, name: {item.name}, unit: {item.unit}, quantity: {item.quantity}, location: {item.location}]' 
                for item in similar_items
            ],
            'User input items:',
            *[
                f'[id: {key}, name: {item.name}, unit: {item.unit}, quantity: {item.quantity}, location: {item.location}]'
                for key, item in parsed_items.items()
            ]
        ])
        ai_response = self._client_parse(
            content_system=content_system,
            content_user=content_user,
            response_format=ReconcileItemSchemaList
        )
        return {item.entry_id: item for item in ai_response.response}

    def llm_assign_tags(
        self, tag_query: Query, parsed_items: dict[str, ParseItemSchema], embedded_items: dict[str, EmbeddedVector]
    ) -> dict[str, AssignTagsSchema]:
        similar_tags = set()
        for embedded_vec in embedded_items.values():
            similar_tags.update(
                self._top_k_similar_tags(
                    tag_query, embedded_vec, k=3
                )
            )
        content_system = (
            'As an AI-powered inventory assistant, you will receive two lists:'
            '1. Database Tags: existing tag records in the format [id, name];'
            '2. User input items: user-entered items in the format [id, name, unit, quantity, location].'
            'For each user input item, select the most appropriate tags (multiple tags allowed) based on common sense and semantics.'
            'You may use fuzzy matching (e.g., match "full-cream milk" to the "milk" tag) and your general knowledge about the items.'
            'Please strictly follow the AIResponseTaggingSet structure for your response.'
        )
        content_user = '\n'.join([
            'Database Tags:',
            *[
                f'[id: {tag.id}, name: {tag.name}]' 
                for tag in similar_tags
            ],
            'User input items:',
            *[
                f'[id: {key}, name: {item.name}, unit: {item.unit}, quantity: {item.quantity}, location: {item.location}]'
                for key, item in parsed_items.items()
            ]
        ])
        ai_response = self._client_parse(
            content_system=content_system,
            content_user=content_user,
            response_format=AssignTagsSchemaList
        )
        return {item.entry_id: item for item in ai_response.response}

    def _client_parse(
        self, content_system: str, content_user: str, response_format: BaseModel
    ) -> BaseModel:
        '''Parse content using the OpenAI client.'''
        response = self.client.chat.completions.parse(
            model=self.model_name,
            messages=[
                { 'role': 'system', 'content': content_system },
                { 'role': 'user', 'content': content_user }
            ],
            response_format=response_format
        )
        return response.choices[0].message.parsed

    def _get_embeddings(self, text: list[str]) -> list[EmbeddedVector]:
        '''Get the embedding for a given text using OpenAI's API.'''
        response = self.client.embeddings.create(
            input=text,
            model='text-embedding-3-small'
        )
        return [tuple(data.embedding) for data in response.data]

    def _top_k_similar_items(self, query: Query, embedded_vec: EmbeddedVector, k: int) -> list[Item]:
        '''Get the top k most similar items to a given query string.'''
        results = (
            query.with_entities(
                Item,
                Item.embedding.cosine_distance(embedded_vec).label('distance')
            )
            .order_by('distance')
            .limit(k)
            .all()
        )
        return [item for item, _ in results]

    def _top_k_similar_tags(self, query: Query, embedded_vec: EmbeddedVector, k: int) -> list[Tag]:
        '''Get the top k most similar tags to a given query string.'''
        results = (
            query.with_entities(
                Tag,
                Tag.embedding.cosine_distance(embedded_vec).label('distance')
            )
            .order_by('distance')
            .limit(k)
            .all()
        )
        return [tag for tag, _ in results]
    

ai_client = InventoryAIClient()


def run_create_items(
    db: Session, user_id: str, querys: list[str], query_id: str, id_prefix: str = ''
) -> DraftResponse:
    
    '''Set the database session for the AI client.'''
    ai_client.set_db(db)

    '''Create structured items from a list of query strings.'''
    parsed_items = ai_client.llm_parse_items(
        querys=querys, 
        prefix=id_prefix
    )

    ''' Get embeddings for parsed items. '''
    embedded_items = ai_client.embedding_parse_items(
        parsed_items=parsed_items
    )

    ''' Reconcile parsed items with existing items in the database. '''
    reconciled_items = ai_client.llm_reconcile_items(
        item_query=Item.active(db),
        parsed_items=parsed_items,
        embedded_items=embedded_items
    )

    ''' Assign tags to items based on parsed items and their embeddings. '''
    create_items = {
        key: parsed_items[key]
        for key in parsed_items.keys() if reconciled_items[key].action == "create"
    }
    create_embedded_items = {key: embedded_items[key] for key in create_items.keys()}
    assigned_tags = ai_client.llm_assign_tags(
        tag_query=db.query(Tag), 
        parsed_items=create_items, 
        embedded_items=create_embedded_items
    )
    assigned_tag_ids = {key: item.tag_ids for key, item in assigned_tags.items()}

    ''' Prepare the response with created and updated items. '''
    response = DraftResponse(
        query_id=query_id,
        item_create=[],
        item_transaction=[],
    )

    ''' Process the reconciled items and prepare the response. '''
    for entry_id, item_action in reconciled_items.items():
        if item_action.action == "create":
            item_create = ItemCreate(
                id=entry_id,
                name=parsed_items[entry_id].name,
                unit=parsed_items[entry_id].unit,
                quantity=parsed_items[entry_id].quantity,
                location=parsed_items[entry_id].location,
                raw_input=parsed_items[entry_id].raw_input,
                tag_ids=assigned_tag_ids.get(entry_id, []),
            )
            response.item_create.append(item_create)
        elif item_action.action == "update":
            transaction_create = TransactionCreate(
                item_id=item_action.existing_item_id,
                user_id=user_id,
                quantity=item_action.quantity,
                changeType='ADD' if item_action.quantity > 0 else 'REMOVE',
                raw_input=parsed_items[entry_id].raw_input
            )
            response.item_transaction.append(transaction_create)

    return response
