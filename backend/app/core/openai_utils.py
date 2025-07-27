from openai import OpenAI
from sqlalchemy.orm import Session, Query
import tiktoken
from app.core.config import settings
from app.models.item import Item
from app.models.tag import Tag


client = OpenAI(api_key=settings.OPENAI_API_KEY)

def get_openai_client() -> OpenAI:
    '''Get the OpenAI client instance.'''
    if not client.api_key:
        raise ValueError("OpenAI API key is not set.")
    return client


def count_tokens(text: str) -> int:
    '''Count the number of tokens in a given text.'''
    encoding = tiktoken.get_encoding('cl100k_base')
    return len(encoding.encode(text))


def get_embeddings(text: list[str]) -> list[list[float]]:
    '''Get the embedding for a given text using OpenAI's API.'''
    response = client.embeddings.create(
        input=text,
        model='text-embedding-3-small'
    )
    return [data.embedding for data in response.data]


def top_k_similar_items(query: Query, embedded_vec: list[float], k: int) -> list[Item]:
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


def top_k_similar_tags(query: Query, embedded_vec: list[float], k: int) -> list[Tag]:
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
