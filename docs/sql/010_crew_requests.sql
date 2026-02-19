create table if not exists public.crew_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  requested_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  responded_at timestamptz,

  constraint crew_requests_no_self check (requester_id <> requested_id)
);

create unique index if not exists crew_requests_pair_pending
on public.crew_requests (
  least(requester_id, requested_id),
  greatest(requester_id, requested_id)
)
where status = 'pending';

create index if not exists idx_crew_requests_requester on public.crew_requests (requester_id, created_at desc);
create index if not exists idx_crew_requests_requested on public.crew_requests (requested_id, created_at desc);

alter table public.crew_requests enable row level security;
