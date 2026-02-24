# Profile Module

## Purpose
Displays and edits the user profile, XP/level information, and crew/battle stats.

## Key Screens
- ProfileScreen
- DevDebugScreen (debug-only connectivity checks)

## Key Services Used
- `CrewService`
- Supabase client
- `AuthContext` and `ThemeContext`

## Data Tables Touched (Read/Write)
- `profiles` (read/write)
- `battle_participants` (read)
- `crew_members` (read)
- `crew_requests` (read)

## Edge Functions Used
- None

## Realtime Subscriptions
- `profiles` updates for the current user

## Gotchas / Dev Notes
- XP/level is currently read from `profiles` fields (XP-only engagement right now).
- Profile updates are direct table writes; avoid overwriting server-managed fields.
