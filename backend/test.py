from openai import OpenAI
import tiktoken
from fastapi import Depends
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
import app.core.openai_utils as ai_utils
from app.schemas.admin import AIResponseItemInfo
import uuid

from app.models.item import Item


def test():

    db = Depends(get_db)

    # Example query to test the OpenAI embedding functionality
    query = [
        '10 kg bag of rice',
        'Carton of 30 eggs',
    ]
    query_id = 'ainew-202507261101'
    # Ask OpenAI for structured query response
    client = ai_utils.get_openai_client()
    response = client.chat.completions.parse(
        model='gpt-4o-mini',
        messages=[
            {
                'role': 'system',
                'content': 'You are an AI assistant that helps with inventory management. Please provide the structured information for the following query. Each line should represent an item with its details: name, unit, quantity, location (optional), and raw input text. Raw input text is the original query text line that the item was created from.',
            },
            {
                'role': 'user',
                'content': '\n'.join(query)
            }
        ],
        response_format=AIResponseItemInfo
    )
    item_list = response.choices[0].message.parsed.items
    print(item_list)

    

if __name__ == "__main__":
    test()
