
from dotenv import load_dotenv
import os
load_dotenv()

from sqlalchemy import text
from app.dependencies.db import engine, SessionLocal
from app.models import Base, User, Family, Membership, Item, Transaction, Tag
from app.core.security import hash_password, hash_security_answer
import logging
from datetime import datetime

# 🧹 静音 SQLAlchemy 日志
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

db = SessionLocal()

print("\n🚧 清空数据库...")
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("✅ 表结构已重建")

print("\n🔁 重置主键序列...")
with engine.connect() as conn:
    for table in ["users", "families", "memberships", "items", "transactions", "tags"]:
        try:
            conn.execute(text(f"ALTER SEQUENCE {table}_id_seq RESTART WITH 1;"))
        except Exception:
            pass
print("✅ 主键序列重置完成")

# 👤 用户
print("\n👤 插入测试用户...")
alice = User(
    username="alice",
    email="alice@example.com",
    password_hash=hash_password("password123"),
    phone_number="1234567890",
    notes="测试用户 Alice",
    security_question="你的猫叫什么？",
    security_answer_hash=hash_security_answer("大黄"),
)

bob = User(
    username="bob",
    email="bob@example.com",
    password_hash=hash_password("password123"),
    phone_number="0987654321",
    notes="测试用户 Bob",
    security_question="你的猫叫什么？",
    security_answer_hash=hash_security_answer("大黄"),
)

db.add_all([alice, bob])
db.commit()
db.refresh(alice)
db.refresh(bob)
print("✅ 添加用户完成")

# 🏠 家庭
print("\n🏠 创建共享家庭...")
family = Family(
    name="测试家庭",
    notes="Alice 和 Bob 的共享家庭"
)
db.add(family)
db.commit()
db.refresh(family)
print(f"✅ 家庭创建完成（ID: {family.id}）")

# 👥 绑定 Membership
print("\n🔗 添加成员到家庭...")
db.add_all([
    Membership(user_id=alice.id, family_id=family.id, role="adult"),
    Membership(user_id=bob.id, family_id=family.id, role="child")
])
db.commit()
print("✅ 成员绑定完成")

# 🏷️ 添加标签
print("\n🏷️ 添加标签...")
tag_food = Tag(name="主食", family_id=family.id)
tag_drink = Tag(name="饮品", family_id=family.id)
db.add_all([tag_food, tag_drink])
db.commit()
db.refresh(tag_food)
db.refresh(tag_drink)
print("✅ 标签添加完成")

# 📦 添加物品
print("\n📦 添加物品...")
rice = Item(
    name="大米",
    unit="袋",
    quantity=10,
    location="厨房",
    family_id=family.id,
    owner_id=alice.id,
    notes="5kg",
    check_interval_days=30,
    tags=[tag_food]
)

milk = Item(
    name="牛奶",
    unit="瓶",
    quantity=6,
    location="冰箱",
    family_id=family.id,
    owner_id=bob.id,
    notes="全脂",
    check_interval_days=7,
    tags=[tag_drink]
)

db.add_all([rice, milk])
db.commit()
db.refresh(rice)
db.refresh(milk)
print("✅ 物品添加完成")

# 📈 添加交易
print("\n📈 添加交易记录...")
tx1 = Transaction(
    item_id=rice.id,
    user_id=alice.id,
    change_type="ADD",
    quantity=2,
    raw_input="补充2袋大米"
)

tx2 = Transaction(
    item_id=milk.id,
    user_id=bob.id,
    change_type="ADD",
    quantity=3,
    raw_input="补充3瓶牛奶"
)

db.add_all([tx1, tx2])
db.commit()
print("✅ 交易记录添加完成")

print("\n🎉 seed 数据已全部添加完毕。")

db.close()
print("\n🌱 数据库初始化完成！准备好测试了 😄\n")
