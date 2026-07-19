import unittest

from app.crud.tag import create_tag, create_tags
from app.schemas.tag import TagCreate


class FakeQuery:
    def __init__(self):
        self.filters = []

    def filter_by(self, **kwargs):
        self.filters.append(kwargs)
        return self

    def first(self):
        return None


class FakeDb:
    def __init__(self):
        self.query_result = FakeQuery()
        self.next_id = 100

    def query(self, _model):
        return self.query_result

    def add(self, _model):
        return None

    def commit(self):
        return None

    def refresh(self, model):
        model.id = self.next_id
        self.next_id += 1


class TagCrudTests(unittest.TestCase):
    def test_create_tag_checks_duplicates_within_family(self):
        db = FakeDb()

        created = create_tag(db, TagCreate(name="Pantry", familyId=7))

        self.assertEqual(created.id, 100)
        self.assertEqual(
            db.query_result.filters,
            [{"name": "Pantry", "family_id": 7}],
        )

    def test_bulk_create_maps_temporary_ids_to_created_ids(self):
        db = FakeDb()

        response = create_tags(db, [
            TagCreate(id="tmp-1", name="Pantry", familyId=7),
            TagCreate(id="tmp-2", name="Food", familyId=7),
        ])

        self.assertEqual(response.failed, [])
        self.assertEqual(
            [(status.tag_id, status.created_tag_id) for status in response.success],
            [("tmp-1", "100"), ("tmp-2", "101")],
        )


if __name__ == "__main__":
    unittest.main()
