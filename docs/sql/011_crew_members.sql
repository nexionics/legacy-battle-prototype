create table if not exists public.crew_members (
  user_id uuid not null references auth.users(id) on delete cascade,
  crew_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),

  constraint crew_members_no_self check (user_id <> crew_user_id),
  primary key (user_id, crew_user_id)
);

create index if not exists idx_crew_members_user on public.crew_members (user_id, created_at desc);

alter table public.crew_members enable row level security;
