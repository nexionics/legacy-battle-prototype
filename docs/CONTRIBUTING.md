# Contributing

## Module Boundaries
To keep the architecture stable and easy to onboard:

- **Modules may import from:**
  - Their own module (`src/modules/<module>`)
  - `src/shared/*`
  - `src/app/*` (navigation types/hooks only)
- **Modules should NOT import from other modules directly.**
  - If a cross-module dependency is unavoidable, expose a **public entry point** in the target module (e.g. `src/modules/battles/index.ts`) and import only from that entry.
  - Prefer shared abstractions or interfaces when possible.

## Data Layer Rules
- Screens should **not** call Supabase directly.
- Reads go through module repositories (`*Repo`).
- Writes go through module services (`*Service`).
- Edge Function calls must use the shared wrapper in `src/shared/lib/edgeFunctions.ts`.

## Paths & Aliases
Runtime aliases are supported via Babel:
- `@/app/*`
- `@/modules/*`
- `@/shared/*`

Keep imports consistent with these aliases to avoid runtime mismatch.
