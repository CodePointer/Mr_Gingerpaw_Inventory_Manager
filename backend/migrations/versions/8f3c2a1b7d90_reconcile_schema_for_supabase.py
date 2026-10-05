"""reconcile application schema and enable pgvector

Revision ID: 8f3c2a1b7d90
Revises: 3bc756afeafb
Create Date: 2026-10-05

"""
from typing import Sequence, Union

from alembic import op
from pgvector.sqlalchemy import Vector
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "8f3c2a1b7d90"
down_revision: Union[str, None] = "3bc756afeafb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Supabase supports pgvector. Creating it in the default schema also keeps
    # this migration compatible with the repository's local pgvector image.
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.add_column("users", sa.Column("security_question", sa.String(), nullable=True))
    op.add_column("users", sa.Column("security_answer_hash", sa.String(), nullable=True))
    op.add_column(
        "users",
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=True),
    )
    op.add_column("users", sa.Column("deleted_at", sa.DateTime(), nullable=True))
    op.add_column("users", sa.Column("deleted_by", sa.Integer(), nullable=True))
    op.add_column("users", sa.Column("deleted_note", sa.String(), nullable=True))
    op.create_foreign_key(
        "users_deleted_by_fkey", "users", "users", ["deleted_by"], ["id"]
    )

    op.add_column(
        "families",
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=True),
    )
    op.add_column("families", sa.Column("deleted_at", sa.DateTime(), nullable=True))
    op.add_column("families", sa.Column("deleted_by", sa.Integer(), nullable=True))
    op.add_column("families", sa.Column("deleted_note", sa.String(), nullable=True))
    op.create_foreign_key(
        "families_deleted_by_fkey", "families", "users", ["deleted_by"], ["id"]
    )

    op.drop_column("items", "category")
    op.drop_constraint("_item_uc", "items", type_="unique")
    op.add_column("items", sa.Column("check_interval_days", sa.Integer(), nullable=True))
    op.add_column("items", sa.Column("last_checked_date", sa.DateTime(), nullable=True))
    op.add_column("items", sa.Column("restock_threshold", sa.Float(), nullable=True))
    op.add_column("items", sa.Column("embedding", Vector(1536), nullable=True))
    op.add_column(
        "items",
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=True),
    )
    op.add_column("items", sa.Column("deleted_at", sa.DateTime(), nullable=True))
    op.add_column("items", sa.Column("deleted_by", sa.Integer(), nullable=True))
    op.add_column("items", sa.Column("deleted_note", sa.String(), nullable=True))
    op.create_foreign_key(
        "items_deleted_by_fkey", "items", "users", ["deleted_by"], ["id"]
    )
    op.create_unique_constraint(
        "_item_uc",
        "items",
        ["name", "unit", "location", "family_id", "owner_id"],
    )

    cancel_status = postgresql.ENUM("ACTIVE", "CANCELLED", name="cancel_status")
    cancel_status.create(op.get_bind(), checkfirst=True)
    op.drop_column("transactions", "family_id")
    op.drop_column("transactions", "unit")
    op.drop_column("transactions", "location")
    op.add_column(
        "transactions",
        sa.Column(
            "status",
            cancel_status,
            server_default="ACTIVE",
            nullable=True,
        ),
    )
    op.add_column("transactions", sa.Column("cancelled_at", sa.DateTime(), nullable=True))
    op.add_column("transactions", sa.Column("cancel_reason", sa.String(), nullable=True))

    op.create_table(
        "tags",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("family_id", sa.Integer(), nullable=False),
        sa.Column("embedding", Vector(1536), nullable=True),
        sa.ForeignKeyConstraint(["family_id"], ["families.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name", "family_id", name="_tag_uc_family_scope"),
    )
    op.create_index(op.f("ix_tags_id"), "tags", ["id"], unique=False)
    op.create_table(
        "item_tags",
        sa.Column("item_id", sa.Integer(), nullable=False),
        sa.Column("tag_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["item_id"], ["items.id"]),
        sa.ForeignKeyConstraint(["tag_id"], ["tags.id"]),
        sa.PrimaryKeyConstraint("item_id", "tag_id"),
    )

    llm_query_type = postgresql.ENUM(
        "PARSING",
        "MATCHING",
        "TAGGING",
        "UNKNOWN",
        name="llmquerytype",
        create_type=False,
    )
    llm_query_type.create(op.get_bind(), checkfirst=True)
    op.create_table(
        "ai_query_sessions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("raw_input", sa.String(), nullable=False),
        sa.Column("final_output", sa.JSON(), nullable=True),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("status_updated_at", sa.DateTime(), nullable=True),
        sa.Column("error_message", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_ai_query_sessions_id"), "ai_query_sessions", ["id"], unique=False
    )
    op.create_table(
        "llm_logs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("session_id", sa.Integer(), nullable=False),
        sa.Column("query_type", llm_query_type, nullable=False),
        sa.Column("content_user", sa.String(), nullable=False),
        sa.Column("output_structure", sa.JSON(), nullable=True),
        sa.Column("model_version", sa.String(), nullable=False),
        sa.Column("token_usage", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["session_id"], ["ai_query_sessions.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_llm_logs_id"), "llm_logs", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_llm_logs_id"), table_name="llm_logs")
    op.drop_table("llm_logs")
    op.drop_index(op.f("ix_ai_query_sessions_id"), table_name="ai_query_sessions")
    op.drop_table("ai_query_sessions")
    postgresql.ENUM(name="llmquerytype").drop(op.get_bind(), checkfirst=True)

    op.drop_table("item_tags")
    op.drop_index(op.f("ix_tags_id"), table_name="tags")
    op.drop_table("tags")

    op.drop_column("transactions", "cancel_reason")
    op.drop_column("transactions", "cancelled_at")
    op.drop_column("transactions", "status")
    postgresql.ENUM(name="cancel_status").drop(op.get_bind(), checkfirst=True)
    op.add_column("transactions", sa.Column("location", sa.String(), nullable=True))
    op.add_column("transactions", sa.Column("unit", sa.String(), nullable=False))
    op.add_column("transactions", sa.Column("family_id", sa.Integer(), nullable=False))
    op.create_foreign_key(
        "transactions_family_id_fkey",
        "transactions",
        "families",
        ["family_id"],
        ["id"],
    )

    op.drop_constraint("items_deleted_by_fkey", "items", type_="foreignkey")
    op.drop_constraint("_item_uc", "items", type_="unique")
    for column in (
        "deleted_note",
        "deleted_by",
        "deleted_at",
        "is_active",
        "embedding",
        "restock_threshold",
        "last_checked_date",
        "check_interval_days",
    ):
        op.drop_column("items", column)
    op.add_column("items", sa.Column("category", sa.String(), nullable=True))
    op.create_unique_constraint(
        "_item_uc", "items", ["name", "unit", "location", "family_id"]
    )

    op.drop_constraint("families_deleted_by_fkey", "families", type_="foreignkey")
    for column in ("deleted_note", "deleted_by", "deleted_at", "is_active"):
        op.drop_column("families", column)

    op.drop_constraint("users_deleted_by_fkey", "users", type_="foreignkey")
    for column in (
        "deleted_note",
        "deleted_by",
        "deleted_at",
        "is_active",
        "security_answer_hash",
        "security_question",
    ):
        op.drop_column("users", column)
