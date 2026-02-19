# Architecture Overview

## Mobile App (Expo / React Native)

The mobile app handles all user-facing functionality:

- Authentication (email/password via Supabase Auth)
- Battle creation, joining, and viewing
- Profile management (display name, XP, rank)
- Crew system (add by username, requests, crew-only battles)
- Sports event browsing (upcoming games, recent results)
- XP progress and achievement display

The app does NOT handle:

- XP awarding (server-side only via Edge Functions)
- Battle resolution (server-side only via Edge Functions)
- Sports data ingestion (separate microservice)

## Supabase

Supabase provides:

- **Auth**: Email/password authentication
- **Database (Postgres)**: All application data
- **Edge Functions**: Server-authoritative logic (award-xp, resolve-battles)
- **Realtime**: Live updates for profiles and battles via subscriptions

### Key Tables

| Table | Purpose |
|---|---|
| `profiles` | User profiles (username, display_name, xp, level, wallet_balance) |
| `battles` | Battle records (title, stake, status, visibility, winner_id) |
| `battle_participants` | Links users to battles with picks |
| `sports_events` | Sports event data from TheSportsDB |
| `sports_teams` | Team metadata (badges, abbreviations) |
| `xp_events` | XP ledger (immutable, unique constraint prevents double-awards) |
| `achievements` | Achievement definitions (rank milestones) |
| `user_achievements` | Tracks which achievements each user has earned |
| `crew_requests` | Crew/buddy request system (pending/accepted/rejected) |

### Edge Functions

| Function | Purpose |
|---|---|
| `award-xp` | Awards XP for actions (create/join/resolve/share), idempotent |
| `resolve-battles` | Auto-resolves battles when linked sports events reach "final" status |

## Sports Microservice

Runs separately on AWS Lightsail. Ingests data from TheSportsDB into `sports_events` and `sports_teams` tables.

**Do not modify sports ingestion logic from this repository.**
