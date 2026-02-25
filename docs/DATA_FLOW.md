# Data Flow

## Reads (Client → Supabase)
The app follows a repository pattern for all reads:

```
UI Screens → Module Repos → Supabase
```

- Screens call module repositories (e.g., `BattlesRepo`, `SportsRepo`).
- Repos contain **only** Supabase query logic.
- This keeps data access consistent and easy to audit.

## Writes (Client → Edge Functions → DB)
Writes that affect sensitive tables are routed through Edge Functions:

```
UI Screens → Module Services → callEdgeFunction → Edge Function → DB
```

- `callEdgeFunction` standardizes payloads and error handling.
- Direct client writes to protected tables should be avoided.

## Sports Ingestion Flow
Sports data is ingested outside this repo:

```
Lightsail Sports Service → Supabase sports_* tables → App (via SportsRepo)
```

- The mobile app reads from `sports_events`, `sports_teams`, and `sports_players`.
- No ingestion or ESPN mapping logic lives in this repo.
