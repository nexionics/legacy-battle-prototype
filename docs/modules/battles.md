# Battles Module

## Purpose
Manages the core battle experience: listing battles, creating challenges, joining battles, and viewing battle details.

## Key Screens
- BattlesScreen
- BattleDetailScreen
- CreateBattleScreen
- BattleTypeScreen
- BattleVisibilityScreen
- StartBattleScreen
- ExploreScreen
- StatDuelModeScreen
- StatDuelDetailsScreen
- StatDuelOpponentScreen
- StatDuelChampionScreen
- StatDuelConfirmScreen

## Key Services Used
- `BattleService`
- Supabase client for realtime subscriptions

## Data Tables Touched (Read/Write)
- `battles` (read/write)
- `battle_participants` (read/write)
- `crew_requests` (read-only for crew visibility checks)

## Edge Functions Used
- None (battle creation/joining uses direct table writes today)

## Realtime Subscriptions
- `battles` table changes (list refresh)
- `battle_participants` table changes (per-battle participant updates)

## Gotchas / Dev Notes
- Crew-only battles validate membership via `crew_requests` with `accepted` status.
- Battle status flips to `active` once two participants exist.
- Legacy battle flows rely on event IDs for sports-linked resolution.
