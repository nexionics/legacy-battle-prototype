-- crew_requests policies

drop policy if exists crew_requests_select on public.crew_requests;
create policy crew_requests_select
on public.crew_requests for select
using (auth.uid() = requester_id or auth.uid() = requested_id);

drop policy if exists crew_requests_insert on public.crew_requests;
create policy crew_requests_insert
on public.crew_requests for insert
with check (auth.uid() = requester_id);

drop policy if exists crew_requests_update on public.crew_requests;
create policy crew_requests_update
on public.crew_requests for update
using (auth.uid() = requester_id or auth.uid() = requested_id)
with check (auth.uid() = requester_id or auth.uid() = requested_id);

-- crew_members policies

drop policy if exists crew_members_select on public.crew_members;
create policy crew_members_select
on public.crew_members for select
using (auth.uid() = user_id);

drop policy if exists crew_members_deny_writes on public.crew_members;
create policy crew_members_deny_writes
on public.crew_members for insert
with check (false);

drop policy if exists crew_members_deny_update on public.crew_members;
create policy crew_members_deny_update
on public.crew_members for update
using (false)
with check (false);

drop policy if exists crew_members_deny_delete on public.crew_members;
create policy crew_members_deny_delete
on public.crew_members for delete
using (false);
