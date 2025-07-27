from sqlalchemy import text
from app.dependencies.db import engine, SessionLocal
from app.models import Base, User, Family, Membership, Item, Transaction, Tag
from app.core.security import hash_password, hash_security_answer
import logging
from alembic import op
from datetime import datetime

# 🧹 Silence SQLAlchemy logs
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

db = SessionLocal()

import os
print(os.getenv('APP_ENV', 'default(development)'))

print("\n🚧 Clearing database...")
Base.metadata.drop_all(bind=engine)
print("✅ Table structure rebuilt")

print("\nEnable pgvector extension...")
with engine.connect() as conn:
    conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
    conn.commit()
print("✅ pgvector extension enabled")

print("\n🔄 Recreating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Database tables recreated")

print("\n🔁 Resetting primary key sequences...")
with engine.connect() as conn:
    for table in ["users", "families", "memberships", "items", "transactions", "tags"]:
        try:
            conn.execute(text(f"ALTER SEQUENCE {table}_id_seq RESTART WITH 1;"))
        except Exception:
            pass
print("✅ Primary key sequences reset complete")

# 👤 Users
print("\n👤 Inserting test users...")
alice = User(
    username="alice",
    email="alice@example.com",
    password_hash=hash_password("password123"),
    phone_number="1234567890",
    notes="Test user Alice",
    security_question="What is your cat's name?",
    security_answer_hash=hash_security_answer("Fluffy"),
)

bob = User(
    username="bob",
    email="bob@example.com",
    password_hash=hash_password("password123"),
    phone_number="0987654321",
    notes="Test user Bob",
    security_question="What is your cat's name?",
    security_answer_hash=hash_security_answer("Fluffy"),
)

db.add_all([alice, bob])
db.commit()
db.refresh(alice)
db.refresh(bob)
print("✅ User creation complete")

# 🏠 Family
print("\n🏠 Creating shared family...")
family = Family(
    name="Test Family",
    notes="Alice and Bob's shared family"
)
db.add(family)
db.commit()
db.refresh(family)
print(f"✅ Family creation complete (ID: {family.id})")

# 👥 Bind Membership
print("\n🔗 Adding members to family...")
db.add_all([
    Membership(user_id=alice.id, family_id=family.id, role="adult"),
    Membership(user_id=bob.id, family_id=family.id, role="child")
])
db.commit()
print("✅ Member binding complete")

# 🏷️ Add tags
print("\n🏷️ Adding tags...")
tag_food      = Tag(name="Food",      family_id=family.id)
tag_drink     = Tag(name="Beverages", family_id=family.id)
tag_stationery= Tag(name="Stationery", family_id=family.id)
tag_cleaning  = Tag(name="Cleaning Supplies", family_id=family.id)
tag_garden    = Tag(name="Gardening", family_id=family.id)
db.add_all([tag_food, tag_drink, tag_stationery, tag_cleaning, tag_garden])
db.commit()
for tag in [tag_food, tag_drink, tag_stationery, tag_cleaning, tag_garden]:
    db.refresh(tag)
print("✅ Tag addition complete")

# 📦 Add items
print("\n📦 Adding items...")
rice     = Item(
    name="Rice", unit="bag", quantity=10,
    location="Kitchen", family_id=family.id,
    owner_id=alice.id, notes="5kg bags",
    check_interval_days=30, tags=[tag_food]
)
milk     = Item(
    name="Milk", unit="bottle", quantity=6,
    location="Refrigerator", family_id=family.id,
    owner_id=bob.id, notes="Whole milk",
    check_interval_days=7, tags=[tag_drink]
)
notebook = Item(
    name="Notebook", unit="piece", quantity=15,
    location="Study Room", family_id=family.id,
    owner_id=alice.id, notes="A5 size",
    check_interval_days=365, tags=[tag_stationery]
)
detergent= Item(
    name="Hand Soap", unit="bottle", quantity=4,
    location="Bathroom", family_id=family.id,
    owner_id=bob.id, notes="Lemon scented",
    check_interval_days=30, tags=[tag_cleaning]
)
shovel   = Item(
    name="Shovel", unit="piece", quantity=2,
    location="Storage Room", family_id=family.id,
    owner_id=alice.id, notes="Garden tool",
    check_interval_days=180, tags=[tag_garden]
)
db.add_all([rice, milk, notebook, detergent, shovel])
db.commit()
for item in [rice, milk, notebook, detergent, shovel]:
    db.refresh(item)
print("✅ Item addition complete")

# 📈 Add transactions
print("\n📈 Adding transaction records...")
tx1 = Transaction(
    item_id=rice.id, user_id=alice.id,
    change_type="ADD", quantity=2,
    raw_input="Added 2 bags of rice"
)
tx2 = Transaction(
    item_id=milk.id, user_id=bob.id,
    change_type="ADD", quantity=3,
    raw_input="Added 3 bottles of milk"
)
db.add_all([tx1, tx2])
db.commit()
print("✅ Transaction record addition complete")

print("\n🎉 All seed data has been added successfully.")

db.close()
print("\n🌱 Database initialization complete! Ready for testing 😄\n")
