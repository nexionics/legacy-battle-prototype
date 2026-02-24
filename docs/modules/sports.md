# Sports Module

## Purpose
Fetches and formats sports events and results for the home feed and dedicated sports screens.

## Key Screens
- HomeScreen
- AllUpcomingGamesScreen
- AllResultsScreen

## Key Services Used
- `sportsRepo` (Supabase `sports_*` tables)
- `sportsApi` (repo-first + optional TheSportsDB fallback)

## Data Tables Touched (Read/Write)
- `sports_events` (read)
- `sports_teams` (read via joins)
- `sports_players` (not currently used in client)

## Edge Functions Used
- None

## Realtime Subscriptions
- None

## Gotchas / Dev Notes
- Repo-first flow: if `sports_events` is empty and `EXPO_PUBLIC_ENABLE_SPORTS_FALLBACK=true`, TheSportsDB is used as a fallback.
- `getResultByEventId` accepts either canonical UUIDs (`sports_events.id`) or legacy provider IDs (e.g., ESPN/TheSportsDB).
