# Development Guide

Last reviewed: 2026-07-03

This guide is the practical companion to `PROJECT_STRUCTURE.md`. Commands assume the repository root unless a different directory is shown.

## Prerequisites

- Git
- Docker Desktop or another Compose-compatible runtime
- Python 3.10 or 3.11
- Node.js 22 and npm
- An OpenAI API key for AI features
- Azure Functions Core Tools only when testing the Functions wrapper locally

## First-time setup

### Full Docker Compose stack

For day-to-day development, the repository root `docker-compose.yml` can start PostgreSQL, the FastAPI backend, and the Expo frontend together:

```powershell
docker compose up --build
```

After the first build, normal code edits are live-mounted into the containers:

- Backend edits under `backend/` are picked up by Uvicorn `--reload`.
- Frontend edits under `frontend/` are picked up by Expo/Metro.
- Dependency changes still require an image/container refresh. Re-run `docker compose up --build` after changing `backend/requirements.txt`; restart the frontend container after changing `frontend/package.json` or `frontend/package-lock.json`.

Local URLs:

- Frontend web app: `http://localhost:8081`
- Backend API: `http://localhost:18080`
- Backend Swagger UI: `http://localhost:18080/docs`
- PostgreSQL: `localhost:5432`, database `inventory`, user `admin`, password `secret`

The Compose backend uses safe development defaults instead of loading `backend/.env.development`, because Compose config commands can print loaded env-file secrets. To enable AI features in the container, set `OPENAI_API_KEY` in your shell before starting Compose.

### Database

Start PostgreSQL with pgvector:

```powershell
docker compose up -d postgres
```

The development defaults expose PostgreSQL on `localhost:5432`, database `inventory`, user `admin`, password `secret`.

Important: the committed Alembic history is currently incomplete relative to the models. Do not assume `alembic upgrade head` creates a fully compatible schema until migration drift is repaired.

### Backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Create `backend/.env.development` with the variables listed in `PROJECT_STRUCTURE.md`. Example shape (use your own secrets):

```dotenv
SECRET_KEY=replace-me
ALGORITHM=HS256
DATABASE_URL=postgresql+psycopg2://admin:secret@localhost:5432/inventory
ACCESS_TOKEN_EXPIRE_MINUTES=60
RESET_TOKEN_EXPIRE_MINUTES=15
ADMIN_KEY=replace-me
CORS_ORIGINS=http://localhost:8081,http://localhost:19006
OPENAI_API_KEY=replace-me
```

Run the ASGI app:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Useful checks:

- Health: `http://localhost:8000/ping`
- Version: `http://localhost:8000/version`
- Swagger UI: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

Run from `backend/`, because settings resolve environment files relative to the current process directory.

### Frontend

```powershell
cd frontend
npm ci
```

Create `frontend/.env.development` (or the environment file used by your Expo invocation):

```dotenv
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

Start Expo:

```powershell
npm run start
```

Other scripts are `npm run android`, `npm run ios`, and `npm run web`.

For a physical phone, `localhost` refers to the phone, not the development computer. Set the API base URL to the computer's LAN address and ensure backend CORS/firewall settings allow it.

## Recommended validation

There is not yet a comprehensive automated suite. For changes, use the strongest available combination:

### Backend

```powershell
cd backend
python -m compileall app
```

Then start Uvicorn, open `/docs`, and exercise affected endpoints. The ignored `backend/.test/` directory contains manual `.http` request collections for most resources; they may require local variables and should not be treated as assertions.

### Frontend

```powershell
cd frontend
npx tsc --noEmit
npx expo export --platform web
```

There is no `test` script in `package.json`. `components/__tests__/ThemedText-test.tsx` and its snapshot appear to be starter remnants and do not constitute current feature coverage.

### Integration smoke test

At minimum, verify:

1. `/ping` responds.
2. Register or log in and confirm token persistence after reload.
3. Load the current user's families and select/create one.
4. List items and tags.
5. Submit a draft or direct bulk item change.
6. Confirm quantities after a transaction.
7. If AI code changed, generate a draft and inspect both success and failure behavior.

## Safe change workflow

### API contract change

1. Change or add the Pydantic schema.
2. Implement domain/database behavior in CRUD code.
3. Expose it in a router with authentication and access checks.
4. Update frontend TypeScript contracts.
5. Update the frontend API service.
6. Update the relevant context/hook and UI.
7. Compare generated `/openapi.json` with existing API docs.
8. Smoke-test authorization failures as well as success.

### Database change

1. Update the SQLAlchemy model.
2. Create and carefully review an Alembic revision.
3. Test upgrade against a copy of realistic data.
4. Test downgrade where it is safe and meaningful.
5. Update schemas, CRUD, frontend contracts, seed data, and docs.

Do not use `Base.metadata.create_all()` as a substitute for tracked migrations. It cannot safely evolve existing production tables.

### Frontend state change

Trace the complete chain before editing:

```text
route -> screen -> component -> hook/context -> API service -> backend
```

For draft changes, also inspect the relevant reducer, `aggregator.ts`, `useDraftEffects.ts`, and `useSubmitDraft.ts`. For new domain contexts, place their provider below every provider they consume and above every consumer.

## Authentication and authorization notes

- The backend expects an HTTP Bearer token and resolves its subject to a user email.
- The frontend persists the access token and attaches it in an Axios request interceptor.
- A 401 clears stored token data, but context state/navigation behavior should be tested when changing auth flows.
- Family IDs in URLs must never be trusted by themselves; retain membership/role access checks in backend code.
- Password and security-answer handling belongs in `core/security.py` and auth/user CRUD, never in frontend storage.

## Deployment overview

### Frontend

Pushes to `main` that change `frontend/**` trigger the Static Web Apps workflow. It injects `EXPO_PUBLIC_API_BASE_URL`, exports static web content into `frontend/dist`, and uploads that directory.

### Backend

Pushes to `main` that change `backend/**` trigger the Azure Functions workflow. It deploys the backend folder to `gingerpaw-backend` using OIDC credentials held in GitHub secrets and Azure remote build.

The `.bk` workflows are inactive backups. Avoid editing them unless intentionally restoring/replacing a workflow.

### Deployment configuration checklist

- Backend application settings contain every required `Settings` field.
- Production `DATABASE_URL` supports PostgreSQL and pgvector.
- `CORS_ORIGINS` includes the deployed frontend origin exactly.
- Frontend `EXPO_PUBLIC_API_BASE_URL` points to the Function App/API root.
- GitHub Azure identity and deployment secrets remain valid.
- Database migrations are applied independently; the deployment workflow does not apply them.

## Current cleanup priorities

Before large feature work, the highest-leverage maintenance tasks are:

1. Reconcile Alembic migrations with every current model and add a tracked Alembic configuration.
2. Add backend API tests and frontend typecheck/test scripts to CI.
3. Reconcile frontend service URLs with active backend routes.
4. Pin or lock Python dependencies.
5. Correct the Docker Uvicorn command and validate the image.
6. Repair encoding in legacy documentation without changing intended content.
7. Replace starter READMEs with a short link-based project landing page.
