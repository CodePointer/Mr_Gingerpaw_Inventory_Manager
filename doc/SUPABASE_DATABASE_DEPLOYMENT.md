# Deploy the database to Supabase

Last reviewed: 2026-10-05

This project continues to use SQLAlchemy and Alembic. Supabase hosts the
PostgreSQL database; it does not replace the backend's authentication or data
access code. Database migrations are deployed by
`.github/workflows/deploy-database.yml` whenever database-related files are
merged into `main`, or when the workflow is run manually.

## 1. Create a Supabase project

1. Create a project in the [Supabase dashboard](https://supabase.com/dashboard).
2. Save the database password. It is needed in both connection strings.
3. Open the project and select **Connect**.

The application uses pgvector. The migration enables the `vector` extension
automatically; no Dashboard SQL is required for a new project.

Use a new or empty Supabase project for the first deployment. The checked-in
Alembic history creates the application's tables. Applying it to a database
where those tables were created manually will cause name/history conflicts.

## 2. Add the GitHub secret

In GitHub, open **Settings > Secrets and variables > Actions** and create this
repository secret:

| Secret | Value |
|---|---|
| `SUPABASE_DB_URL` | The Supabase **Session pooler** connection string, with port `5432`, the SQLAlchemy driver in the scheme, and TLS required. |

Start with the exact Session pooler string copied from the Dashboard. It has a
shape similar to:

```text
postgresql+psycopg2://postgres.PROJECT_REF:URL_ENCODED_PASSWORD@POOLER_HOST:5432/postgres?sslmode=require
```

Important details:

- Do not guess the pooler host or username; copy both from **Connect**.
- Change only the scheme from `postgresql://` to
  `postgresql+psycopg2://`.
- Replace the password placeholder and percent-encode reserved characters in
  the password. For example, `@` becomes `%40` and `#` becomes `%23`.
- Keep `sslmode=require`.
- Do not use the Transaction pooler (port `6543`) for schema migrations.
- The secret contains administrative database credentials. Never expose it to
  the Expo frontend, commit it to an env file, or print it in workflow output.

The workflow uses the GitHub `production` environment. Optionally create that
environment under **Settings > Environments** and add required reviewers to
put an approval gate in front of production migrations. The secret may be a
repository secret as described above, or an environment secret with the same
name.

No `SUPABASE_ACCESS_TOKEN`, project reference, anon key, or service-role key is
needed by this workflow because Alembic connects directly to PostgreSQL.

## 3. Configure the deployed backend

The backend needs its own `DATABASE_URL` application setting. Because the
current backend is deployed as an Azure Function, copy the **Transaction
pooler** connection string from Supabase (port `6543`) and format it as:

```text
DATABASE_URL=postgresql+psycopg2://postgres.PROJECT_REF:URL_ENCODED_PASSWORD@POOLER_HOST:6543/postgres?sslmode=require
DB_USE_NULL_POOL=true
```

`DB_USE_NULL_POOL=true` prevents each serverless instance from creating a
second persistent connection pool in front of Supabase's transaction pooler.
Persistent VM/container deployments can instead use a direct or Session
pooler URL and leave `DB_USE_NULL_POOL=false`.

Configure the other backend settings shown in the repository's `env.dist`,
especially `SECRET_KEY`, `ADMIN_KEY`, `CORS_ORIGINS`, and `OPENAI_API_KEY`.
`env.dist` contains placeholders only and is safe to commit; real values are
not.

## 4. Deploy

Before the first production deployment, review all files under
`backend/migrations/versions/`. Then either:

- merge the database changes into `main`; or
- open **Actions > Deploy database to Supabase > Run workflow**.

The workflow:

1. installs the Python migration dependencies;
2. verifies that Alembic has one migration head;
3. applies `alembic upgrade head`;
4. checks that SQLAlchemy models have no uncommitted schema drift; and
5. prints the deployed Alembic revision (never the connection string).

GitHub serializes runs with a concurrency group so two production migrations
cannot run at the same time. Failed migrations stop the workflow and must be
investigated; do not manually edit the `alembic_version` table.

## 5. Local migration commands

Install backend dependencies, set `DATABASE_URL` to a local database or the
Supabase Session pooler URL, and run commands from `backend/`:

```powershell
cd backend
python -m pip install -r requirements.txt
$env:DATABASE_URL = "postgresql+psycopg2://..."
python -m alembic -c alembic.ini current
python -m alembic -c alembic.ini upgrade head
python -m alembic -c alembic.ini check
```

For future model changes, create and review a migration before opening a pull
request:

```powershell
python -m alembic -c alembic.ini revision --autogenerate -m "describe change"
```

Never make production table changes directly in the Supabase Table Editor or
SQL Editor after adopting this workflow. Put each schema change in Alembic so
all environments share the same history. Back up production data and test
destructive migrations against staging before merging them.

## References

- [Supabase database connection methods](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase guidance for SQLAlchemy](https://supabase.com/docs/guides/troubleshooting/using-sqlalchemy-with-supabase-FUqebT)
- [Supabase pgvector setup](https://supabase.com/docs/guides/ai/semantic-search)
