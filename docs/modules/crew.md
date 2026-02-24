# Crew Module

## Purpose
Manages social connections (“crew”), including requests, approvals, and suggestions.

## Key Screens
- FriendsScreen
- AddFriendScreen

## Key Services Used
- `CrewService`
- Supabase Functions (`crew-request`, `crew-respond`)

## Data Tables Touched (Read/Write)
- `crew_requests` (read)
- `crew_members` (read)
- `profiles` (read)
- `battle_participants` (read, for suggestions)

## Edge Functions Used
- `crew-request`
- `crew-respond`

## Realtime Subscriptions
- None

## Gotchas / Dev Notes
- Crew request creation and responses are **server-authoritative** via Edge Functions.
- Suggestions are derived from co-participation in battles, then filtered against existing crew/pending requests.
