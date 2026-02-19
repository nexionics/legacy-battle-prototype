# Sports Data Pipeline

## Overview

Sports data is ingested by a separate microservice running on AWS Lightsail. The mobile app only reads from the resulting database tables.

**Do not edit sports ingestion logic from this repository.**

## Data Flow

1. Microservice fetches data from TheSportsDB API
2. Data is written to Supabase tables: `sports_events` and `sports_teams`
3. Mobile app reads these tables to display upcoming games and recent results
4. The `resolve-battles` Edge Function checks `sports_events.status` to auto-resolve battles

## Key Tables

- `sports_events`: Game schedules, scores, status (e.g., "Not Started", "final")
- `sports_teams`: Team names, badges, abbreviations

## Battle Resolution

When `sports_events.status = 'final'`, the `resolve-battles` Edge Function:

1. Finds all active battles linked to that event
2. Compares participant picks against actual scores
3. Sets `winner_id`, `resolved_at`, and `final_outcome`
4. Awards `verified_resolution` XP (+100) to all participants
