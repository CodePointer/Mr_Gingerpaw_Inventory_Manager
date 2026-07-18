# Frontend i18n Structure

Last reviewed: 2026-07-18

The frontend uses `i18next` with one namespace per product area. Locale files live under:

```text
frontend/locales/en/*.json
frontend/locales/zh/*.json
```

## Namespace hierarchy

### `common`

Shared text that can appear anywhere.

- `app.*`: application identity, such as `app.title`.
- `buttons.*`: reusable button labels, such as `confirm`, `cancel`, `submit`, `create`, `save`, `delete`, `learnMore`.
- `navigation.tabs.*`: tab labels keyed by route name.
- `emptyState.*`: generic fallback text, such as `noData`, `noFamily`, `notSet`.

### `auth`

Authentication and password recovery.

- `screens.*`: page/modal titles.
- `form.*`: field labels.
- `actions.*`: auth-specific button labels.
- `validation.*`: client-side validation messages.
- `status.*`: operation success/failure messages.

### `home`

Home dashboard and AI assistant entry points.

- `greeting`
- `notifications.*`
- `aiManager.*`
- `aiDraft.modal.*`

### `items`

Inventory, item forms, filters, tags, locations, and item cards.

- `search.*`
- `filter.*`
- `menu.*`
- `form.title|mode|sections|fields|existingItem`
- `location.*`
- `tags.title|search|fields|actions|errors`
- `card.status.*`
- `pagination.*`

### `draft`

Pending local changes before submission.

- `sections.newItems|updatedItems|deletedItems|transactions`
- `actions.*`
- `errors.*`

### `me`

Profile, settings, language, security, family, and invitations.

- `profile.*`
- `settings.*`
- `language.*`
- `security.*`
- `family.manager|actions|modal|form|messages|invitation`

## Naming rules

Use semantic keys, not visual placement. For example:

- Good: `auth.validation.passwordMismatch`
- Avoid: `auth.alert.passwordMismatch`

Use plural groups for reusable action collections:

- `common.buttons.*`
- `auth.actions.*`
- `items.tags.actions.*`

Use `status.*`, `validation.*`, or `errors.*` based on message intent:

- `validation`: the user must correct input before sending.
- `status`: result of an auth/account operation.
- `errors`: failed data operation after an API or submit attempt.

Keep English and Chinese files structurally identical. When adding a key, add it to both languages in the same namespace.
