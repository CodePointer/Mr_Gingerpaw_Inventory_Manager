# Project Structure

Last reviewed: 2026-10-05

## 1. Purpose and system shape

The Great Orange is a family inventory application. Users authenticate, join or create families, manage household items and tags, record quantity-changing transactions, and generate draft inventory changes from natural-language input.

The repository is a small monorepo with three principal parts:

```text
Expo / React Native client
          |
          | JSON over HTTP, Bearer JWT
          v
FastAPI application (also wrapped as an Azure Function)
          |
          | SQLAlchemy
          v
PostgreSQL + pgvector
```

The frontend owns presentation and client-side draft state. The backend owns authentication, authorization, persistence, inventory rules, and OpenAI/embedding integration.

## 2. Repository map

```text
the_great_orange/
|-- .github/workflows/       Active and backup Azure deployment workflows
|-- backend/                 Python FastAPI and Azure Functions application
|   |-- .test/               Manual HTTP request collections (ignored by git)
|   |-- app/
|   |   |-- core/            Configuration, security, JWT, AI, and utilities
|   |   |-- crud/            Database operations and domain logic
|   |   |-- dependencies/    FastAPI database and current-user dependencies
|   |   |-- models/          SQLAlchemy persistence models
|   |   |-- routers/         HTTP endpoint definitions
|   |   |-- schemas/         Pydantic request/response contracts
|   |   `-- main.py          FastAPI construction and router registration
|   |-- HttpTrigger/         Azure Functions catch-all ASGI adapter
|   |-- migrations/          Alembic migration environment and revisions
|   |-- Dockerfile           Alternative container entry point
|   |-- host.json            Azure Functions host configuration
|   |-- requirements.txt     Unpinned Python dependencies
|   |-- seed_data.py         Development seed helper
|   `-- test.py              Ad hoc test script, not a test suite
|-- frontend/                Expo 53 / React Native 0.79 application
|   |-- app/                 Expo Router route files and layouts
|   |-- assets/              Fonts and raster application artwork
|   |-- components/          Screens and reusable UI components
|   |-- constants/           Application constants
|   |-- hooks/               Context providers and domain/UI hooks
|   |-- locales/             English and Chinese translation resources
|   |-- services/
|   |   |-- api/             Typed backend API calls
|   |   |-- types/           TypeScript API and domain contracts
|   |   `-- utils/           Axios, token storage, and storage helpers
|   |-- styles/              Theme, layout, spacing, and shared styles
|   |-- app.json             Expo application configuration
|   |-- i18n.ts              Internationalization initialization
|   |-- package.json         JavaScript dependencies and scripts
|   `-- tsconfig.json        Strict TypeScript and `@/*` alias configuration
|-- doc/                     Product, API, design, and maintenance documents
|-- docker-compose.yml       Local pgvector-enabled PostgreSQL service
|-- README.md                Legacy root notes; some text is mis-encoded
`-- scan_dir.py              Standalone repository scanning helper
```

Generated/local directories such as `.conda/`, `.expo/`, `node_modules/`, Python caches, and frontend build output are not part of the application architecture.

## 3. Backend architecture

### 3.1 Startup and request flow

`backend/app/main.py` creates the FastAPI object, installs CORS from settings, registers every router, and defines `/ping`, `/version`, and a custom validation-error handler.

A normal authenticated request follows this path:

```text
router -> FastAPI dependency -> CRUD/domain function -> SQLAlchemy session -> PostgreSQL
              |
              `-> Bearer token -> JWT verification -> current User
```

Responsibilities are intended to be separated as follows:

- `routers/`: HTTP concerns, dependency injection, status codes, and response models.
- `schemas/`: validation and serialized API shapes. Many schemas use aliases to expose camelCase JSON to the frontend.
- `crud/`: queries, writes, access checks, and domain operations.
- `models/`: database tables, relationships, and a few model-level helpers.
- `core/`: cross-cutting infrastructure such as settings, JWTs, password handling, OpenAI calls, timestamps, and access control.
- `dependencies/`: lifecycle-managed database sessions and authenticated-user lookup.

### 3.2 Configuration

`backend/app/core/config.py` loads one environment file based on `APP_ENV`:

```text
APP_ENV=development (default) -> backend/.env.development
APP_ENV=production            -> backend/.env.production
```

Required settings are:

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | JWT signing secret |
| `ALGORITHM` | JWT algorithm |
| `DATABASE_URL` | SQLAlchemy PostgreSQL connection URL |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Login token lifetime |
| `RESET_TOKEN_EXPIRE_MINUTES` | Password-reset token lifetime |
| `ADMIN_KEY` | Protects administrative operations |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `OPENAI_API_KEY` | OpenAI and embedding calls |

Environment files are intentionally ignored. Document variable names only; never commit values.

### 3.3 Router inventory

| Router | Prefix | Main responsibility |
|---|---|---|
| `auth.py` | `/auth` | Register, login, reset question, answer verification, password reset |
| `user.py` | `/users/me` | Current profile, families, memberships, security settings, deactivation |
| `family.py` | `/families` | Family details, members, locations, create/update/delete |
| `membership.py` | `/memberships` | Invitations, joining, role changes, membership removal |
| `item.py` | `/families/{family_id}/items` | Query, bulk changes, checks, tags, restock, AI input |
| `tag.py` | `/families/{family_id}/tags` | List and single/bulk tag changes |
| `transaction.py` | `/families/{family_id}/transactions` | Quantity changes and transaction cancellation/update |
| `transfer.py` | `/items` | Item transfer operation |
| `location.py` | `/families/{fid}/locations` | Placeholder; endpoints are currently commented out |
| `admin.py` | `/admin` | Embedding maintenance and AI query experiments |

`doc/dev/backend_api.md` and `doc/dev/backend_api.json` contain older API reference material. Treat the registered routers as the source of truth and regenerate API documentation from FastAPI before relying on those files.

### 3.4 Persistence model

```text
User 1---* Membership *---1 Family
User 1---* Item       *---1 Family
User 1---* Transaction *---1 Item
Item *---* Tag (through item_tags)
Family 1---* Tag
AIQuerySession 1---* LLMLogs
```

Key tables and semantics:

- `users`: identity, credentials, reset question, profile fields, and logical deletion.
- `families`: household grouping and logical deletion.
- `memberships`: composite key `(user_id, family_id)` plus role (`adult`/`child`).
- `items`: family/owner-scoped inventory record, current quantity, location, check/restock metadata, raw AI input, and a 1,536-dimension embedding.
- `tags`: family-scoped tag name with a 1,536-dimension embedding; `(name, family_id)` is unique.
- `item_tags`: many-to-many association between items and tags.
- `transactions`: `ADD`/`REMOVE` quantity events with cancellable status.
- `ai_query_sessions` and `llm_logs`: AI workflow state, structured output, model metadata, and token usage.

`LogicalDeleteMixin` is used by users, families, and items. `CancellableMixin` is used by transactions. Code that queries these entities should deliberately choose active-only or all records.

### 3.5 Deployment modes

The same FastAPI app has three intended execution modes:

1. Local ASGI: from `backend/`, run `uvicorn app.main:app --reload`.
2. Azure Functions: `HttpTrigger/__init__.py` wraps FastAPI with `AsgiMiddleware`; `function.json` sends all HTTP methods and paths to it.
3. Docker: `backend/Dockerfile` builds a Python 3.11 image. Its checked-in command currently uses `app.main.app`, which is likely invalid Uvicorn module syntax; it should be verified before container use.

The active backend workflow deploys `backend/` to the Azure Function App `gingerpaw-backend` using Python 3.10 and remote build.

## 4. Frontend architecture

### 4.1 Routing

Expo Router provides file-based navigation:

```text
app/_layout.tsx             Root providers and auth route guard
app/index.tsx               Initial token-based redirect
app/(auth)/_layout.tsx      Authentication route layout
app/(auth)/login.tsx        Login
app/(auth)/register.tsx     Registration
app/(auth)/forgetpassword.tsx Password reset flow
app/(tabs)/_layout.tsx      Authenticated tab shell
app/(tabs)/home.tsx         Home/AI entry
app/(tabs)/items.tsx        Inventory browser/editor
app/(tabs)/draft.tsx        Pending bulk changes
app/(tabs)/me.tsx           User, family, and settings management
```

The root layout restores a persisted token. Unauthenticated users are forced into `(auth)`; authenticated users outside `(tabs)` are redirected to `/(tabs)/me`. The index route separately directs authenticated users to `/(tabs)/items`. This difference is intentional in current code but should be revisited if default navigation is changed.

### 4.2 Provider and state hierarchy

The root provider order is significant:

```text
PaperProvider
`-- I18nextProvider
    `-- AlertModalProvider
        `-- ModalProvider
            `-- AuthProvider
                `-- UserProvider
                    `-- FamilyProvider
                        `-- MembershipProvider
                            `-- TagsProvider
                                `-- ItemsProvider
                                    `-- DraftProvider
                                        `-- AppbarProvider
                                            `-- routed screen
```

Domain contexts sit between components and API services. When changing dependencies between contexts, check this order to ensure a consumer is nested under the provider it needs.

The draft subsystem is the most stateful frontend area. Separate reducers track new, updated, deleted, and transaction changes; an aggregator exposes a combined draft, and submission effects coordinate bulk backend requests.

### 4.3 Component organization

- `components/auth/`: full authentication screens.
- `components/home/`: home screen and natural-language AI draft form.
- `components/items/`: inventory cards, filters, pagination, forms, and list composition.
- `components/draft/`: review sections for each pending change type.
- `components/me/`: profile, family, membership, language, and security UI.
- `components/tags/`: tag selection and editing.
- `components/common/`: shared modal, menu, screen, selector, chip, and button primitives.
- `components/navigation/`: React Native Paper header/tab implementations and tab configuration.

Modals are registered centrally in `hooks/modal/ModalContext.tsx` and opened by name. Confirmation/alert dialogs use the promise-based `AlertModalContext`.

### 4.4 Services and API contracts

`services/utils/axiosInstance.ts` creates the shared Axios client from `EXPO_PUBLIC_API_BASE_URL`. A request interceptor reads the persisted token and adds `Authorization: Bearer ...`; a 401 response clears persisted token storage.

`services/api/` is grouped by backend resource. `services/types/` contains request, response, and form contracts. A backend schema change normally requires coordinated changes in all four places:

```text
backend schema/router -> frontend services/types -> frontend services/api -> hook/context/component
```

### 4.5 UI platform concerns

- React Native Paper supplies the component system and theme.
- `styles/` contains shared layout and visual tokens.
- `i18n.ts` registers English and Chinese namespaces stored under `locales/{en,zh}/`.
- `@/*` maps to the frontend root through `tsconfig.json`.
- Tokens are persisted through the token service and AsyncStorage.
- The app targets Android, iOS, and static web output; only web deployment is automated in this repository.

The active frontend workflow uses Node 22, `npm ci`, `npx expo export --platform web`, and deploys `frontend/dist` to Azure Static Web Apps.

## 5. Local infrastructure and data flow

`docker-compose.yml` starts only the database:

- image: `pgvector/pgvector:pg17`
- host port: `5432`
- database: `inventory`
- user: `admin`
- named volume: `postgres_data`

The credentials in Compose are development defaults. Ensure `DATABASE_URL` agrees with them or override both sides.

An inventory change generally flows as follows:

```text
screen/modal
  -> context/hook
  -> typed frontend API function
  -> Axios + JWT
  -> FastAPI router + current-user dependency
  -> access control + CRUD function
  -> SQLAlchemy model/session
  -> PostgreSQL
  -> Pydantic response
  -> context refresh/reducer update
  -> rerender
```

## 6. Known structural risks

These are observations from the documentation review:

1. The Docker command is `uvicorn app.main.app`; normal Uvicorn syntax is `app.main:app`.
2. The frontend calls `GET /families/`, but no active matching family-list endpoint is visible; the current supported family list appears to be `GET /users/me/families`.
3. Frontend single-item update/delete calls exist while the corresponding backend item routes are commented out. Current UI code should use bulk endpoints unless those routes are restored.
4. Automated backend coverage is limited to a small CRUD unit test module. `.test/` primarily contains manual HTTP requests, and the only frontend component test is a legacy snapshot.
5. Python dependencies are mostly unpinned, while frontend dependencies are locked. Backend builds may therefore change over time.
6. The custom FastAPI validation handler attempts `json.loads(body)` unconditionally. Invalid or empty JSON could raise inside error handling.
7. Several existing Markdown/source strings display mojibake, suggesting a historical encoding conversion problem. Preserve UTF-8 when editing.
8. Root and frontend READMEs are mostly legacy starter/TODO content and do not currently serve as reliable onboarding guides.

## 7. Where to make common changes

| Change | Start here | Usually also update |
|---|---|---|
| Add/change an API endpoint | `backend/app/routers/` | schema, CRUD, frontend API/types, API docs |
| Change a database field | `backend/app/models/` | Alembic migration, schema, CRUD, frontend types/forms |
| Change authorization | `backend/app/core/access_control.py` or dependencies | router tests and affected CRUD functions |
| Add a screen | `frontend/app/` | screen component, navigation labels/icons, translations |
| Change shared domain state | `frontend/hooks/<domain>/` | services and consuming components |
| Add an API call | `frontend/services/api/` | `services/types/` and context/hook |
| Add a modal | `frontend/components/` | modal registry/context and translations |
| Change theme/layout | `frontend/styles/` | affected component overrides |
| Change AI behavior | `backend/app/core/ai_client.py`, `openai_utils.py` | admin/item router, AI schemas, draft UI/types |
| Change deployment | `.github/workflows/` | environment/secrets and platform config |

## 8. Documentation index

- `doc/DEVELOPMENT_GUIDE.md`: setup, commands, validation, and change workflow.
- `doc/dev/backend_api.md`: generated/older API detail; verify against live OpenAPI.
- `doc/dev/context_design.md`: earlier frontend context design notes.
- `frontend/DEPENDENCY_TREE.md`: detailed frontend render/dependency map; useful but contains encoding damage and may drift.
- `doc/TODOs.md` and `doc/dev/front_TODOs.md`: product and technical backlog notes.
- `doc/CHANGELOG.md`: historical change notes.
