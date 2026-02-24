# XP Module

## Purpose
Represents XP-based progression and level display. XP is currently stored on the user profile and displayed in the UI.

## Key Screens
- ProfileScreen (XP/level display)

## Key Services Used
- Supabase client (read profile XP/level)

## Data Tables Touched (Read/Write)
- `profiles` (read)

## Edge Functions Used
- `award-xp` (server-authoritative XP awards in the Supabase project)

## Realtime Subscriptions
- None

## Gotchas / Dev Notes
- XP is read-only in the client. Awarding XP should happen server-side.
- Wallet balances are displayed but **wallet logic is not implemented in this repo**.
