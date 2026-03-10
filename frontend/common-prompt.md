# Global Prompt Requirements

## Architecture & Reusability
- Prefer reusing existing components instead of creating new ones.
- If a reusable pattern already exists (e.g. ItemCard, CustomModal, ActionMenu), follow its structure.
- Keep components modular but not over-abstracted.

## UI & Styling
- Prefer using React Native Paper components whenever possible.
- Avoid unnecessary custom styling.
- Keep styles minimal and clean.
- Do not introduce complex layout systems or heavy style objects.
- No excessive inline styles unless necessary.
- Follow existing visual patterns in the project.

## Code Style
- Keep code simple, clear, and readable.
- Avoid overengineering.
- Avoid unnecessary state or complex hooks.
- Do not introduce new libraries.
- Prefer functional components with hooks.
- Keep logic straightforward and easy to maintain.

## i18n
- Use useTranslate and t() for user-facing text.
- Placeholder or non-existing translation keys are acceptable.
- Do not hardcode strings unless explicitly allowed.

## Structure
- Keep folder structure consistent with the existing project.
- Do not move files unless required.
- Follow naming conventions already used in the same directory.
