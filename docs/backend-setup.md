# Backend Setup Documentation

## Supabase Project

- **Project Name**: legacy-battles-dev
- **Region**: (set by user)
- **Project URL**: https://nswfhvznbsjueyvyesdw.supabase.co

## Database Schema

### Tables Created

#### `profiles` table
Linked 1:1 with `auth.users` for public-facing user information.

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| id | uuid (PK) | - | References auth.users(id) |
| username | text (unique) | null | User's unique username |
| display_name | text | null | Display name |
| avatar_url | text | null | Profile picture URL |
| xp | integer | 0 | Experience points |
| level | text | 'Challenger' | User level (Challenger → Legend) |
| wallet_balance | numeric(18,2) | 0 | Battle Coins balance |
| created_at | timestamptz | now() | Creation timestamp |
| updated_at | timestamptz | now() | Last update timestamp |

### SQL to Run in Supabase SQL Editor

Copy and paste this entire block into your Supabase SQL Editor:

```sql
-- =============================================
-- PART 1: Create profiles table
-- =============================================

-- profiles table (linked 1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  xp integer not null default 0,
  level text not null default 'Challenger',
  wallet_balance numeric(18,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

-- =============================================
-- PART 2: Enable Row Level Security (RLS)
-- =============================================

alter table public.profiles enable row level security;

-- Allow authenticated users to select ANY profile (public social info)
create policy "Public read profiles"
on public.profiles
for select
using (true);

-- Allow a logged-in user to insert their own profile
create policy "Insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

-- Allow a logged-in user to update ONLY their own profile
create policy "Update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);
```

## Supabase Client Setup

### Location
`src/lib/supabaseClient.ts`

### Usage
```typescript
import { supabase } from '../lib/supabaseClient';

// Example: Query profiles
const { data, error } = await supabase
  .from('profiles')
  .select('*');

// Example: Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### Environment Variables
Set in `.env` file (not committed to git):
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your anon/public key

## Testing Connection

1. Run the SQL schema in Supabase SQL Editor
2. Start the app: `npx expo start`
3. Navigate to DevDebug screen to verify connection
4. Should show "Status: OK" if connected successfully

## RLS Policies Summary

| Policy | Action | Rule |
|--------|--------|------|
| Public read profiles | SELECT | Anyone can read any profile |
| Insert own profile | INSERT | User can only insert their own profile (id = auth.uid()) |
| Update own profile | UPDATE | User can only update their own profile |

## Next Steps

- Part 2: Implement authentication flow (sign up, login, logout)
- Part 3: Wire up profile creation on sign up
- Part 4: Implement battle creation and wallet transactions
