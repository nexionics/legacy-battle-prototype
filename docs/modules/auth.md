# Auth Module

## Purpose
Handles user authentication, account creation, and initial profile setup. Owns the login/signup flows and provides app-wide auth state.

## Key Screens
- LoginScreen
- SignUpScreen
- OTPVerificationScreen
- CreateUsernameScreen

## Key Services Used
- Supabase Auth (`supabase.auth`)
- `AuthContext` provider (React Context + hooks)

## Data Tables Touched (Read/Write)
- `profiles` (write: ensure profile row on sign-up/sign-in; read in some flows)

## Edge Functions Used
- None

## Realtime Subscriptions
- Auth state change subscription via Supabase Auth (session updates)

## Gotchas / Dev Notes
- Profile creation is **also handled by a DB trigger**; the client only upserts `id` to avoid overwriting auto-generated usernames.
- If email confirmations are enabled, profile creation may be deferred until the user verifies their email.
