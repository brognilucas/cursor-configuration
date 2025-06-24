# Shopping Cart Frontend

## Project Structure

- `components/` — Presenter (dumb) components
- `containers/` — Container (smart) components
- `hooks/` — Custom React hooks for data fetching and business logic
- `types/` — TypeScript type definitions (no inline types)
- `styles/` — Plain CSS files for styling
- `__tests__/` — Tests, mirroring the production structure

## Development Process
- Use Test-Driven Development (TDD): Write a test before implementing any new code.
- Only implement one test at a time.
- After each test passes, confirm if a commit is needed before proceeding.

## Testing
- Use React Testing Library.
- Test behaviors, not implementation details.
- Use fakes for injected dependencies in tests (no mocks).
- No contract testing required for frontend at this stage.
- Follow naming and formatting conventions:
  - `describe`: Name of the class/component being tested.
  - `it`: Describes the behavior.
  - Separate test code sections with blank lines.
  - No conditionals in tests.

## Component & Code Structure
- Use the Container-Presenter Pattern:
  - Container components handle data fetching, state, and logic via hooks.
  - Presenter components render UI based on props.
- Place business logic and data fetching in custom hooks.
- Avoid styled components; use only plain CSS.

## Type Safety
- Define all types/interfaces in `types/`.
- Never use inline types in function signatures or props.

## General Rules
- Clarify any open questions before starting a new feature.
- Never use fakes in production code; only in tests.
- Follow class guidelines if classes are created (private properties with `_`, public methods without `get`/`set`).
