# Mystic Square — Agent Rules

## Code Style

- Follow **Standard JS** style: no semicolons, single quotes, 2-space indentation.
- ESLint is configured with `eslint-config-standard` and `eslint-plugin-react` — all code must pass lint.

## React

- **Prefer functional components with hooks** for all new code.
- Existing class components (e.g., `App`) do not need to be converted unless explicitly requested.
- Use `prop-types` in existing `.js` components; use TypeScript interfaces/types in new `.tsx` components.

## TypeScript

- Write all **new files** in TypeScript (`.ts` / `.tsx`).
- Do **not** convert existing `.js` files to TypeScript unless explicitly asked.
- Prefer strict typing — avoid `any` where possible.

## Styling

- Use **SCSS** for all styles.
- Follow the existing directory structure under `src/styles/`:
  - `abstracts/` — variables, mixins, functions
  - `base/` — resets, typography, global styles
  - `components/` — per-component styles
  - `utils/` — utility/helper classes
- Import new partials in `src/styles/main.scss`.

## Architecture

- **Keep game/domain logic separate from React components.** The `MysticBoard` class pattern (pure logic, no React imports) should be followed for any new game logic.
- Place utility functions in `src/utils/`.
- Place React components in `src/components/`.

## Accessibility

- Use semantic HTML elements where appropriate.
- Ensure interactive elements have proper ARIA attributes and labels.
- Preserve and enhance keyboard navigation (arrow keys, Escape, tab order).

## Performance

- Avoid unnecessary re-renders — use `React.memo`, `useMemo`, and `useCallback` where appropriate in functional components.
- Keep state minimal and co-located with the components that need it.

## Mobile & Responsiveness

- Ensure the puzzle is usable on touch devices.
- Test layouts at mobile viewport sizes; use responsive SCSS (media queries, relative units).

## Git

- Commit messages must follow the **[Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)** specification.
  - Format: `<type>[optional scope]: <description>`
  - Examples: `feat: add 5x5 board size option`, `fix: correct tile swap on edge`, `refactor(board): extract tile rendering logic`

## Verification

- Run `npm start` or lint checks to verify changes compile and work before presenting them.
