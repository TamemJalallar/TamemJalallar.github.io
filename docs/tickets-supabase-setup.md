# Tickets + Supabase Setup

Use this setup to enable persistence, realtime sync, and new-ticket alerts in `/tickets`.

## 1) Environment variables

Add these in your runtime/build environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_TICKETS_BUCKET=ticket-attachments` (optional, default is `ticket-attachments`)

## 2) SQL schema

Run this SQL in Supabase SQL Editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_tickets_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_tickets_updated_at on public.tickets;
create trigger trg_set_tickets_updated_at
before update on public.tickets
for each row
execute function public.set_tickets_updated_at();

alter table public.tickets enable row level security;

-- Demo/open policy. For production, lock this down to authenticated roles.
drop policy if exists "tickets_select_all" on public.tickets;
create policy "tickets_select_all"
on public.tickets
for select
to anon, authenticated
using (true);

drop policy if exists "tickets_insert_all" on public.tickets;
create policy "tickets_insert_all"
on public.tickets
for insert
to anon, authenticated
with check (true);

drop policy if exists "tickets_update_all" on public.tickets;
create policy "tickets_update_all"
on public.tickets
for update
to anon, authenticated
using (true)
with check (true);
```

## 3) Storage bucket for attachments

Create a bucket named `ticket-attachments`.

- Bucket visibility: public (recommended for this front-end implementation)
- Allowed MIME: images/videos/docs as needed

Storage policies (demo/open):

```sql
-- Select (read)
drop policy if exists "ticket_attachments_read" on storage.objects;
create policy "ticket_attachments_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'ticket-attachments');

-- Insert (upload)
drop policy if exists "ticket_attachments_insert" on storage.objects;
create policy "ticket_attachments_insert"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'ticket-attachments');
```

## 4) Realtime for alerts

Enable Realtime for `public.tickets` in Supabase:

- Database -> Replication -> add table `tickets` to publication `supabase_realtime`

The Tickets UI subscribes to inserts/updates and raises in-app + desktop alerts for new tickets.

## 5) Production hardening recommendations

- Replace open RLS policies with user-scoped access.
- Add server-side validation for workflow transitions.
- Store activity and attachments in separate relational tables when scale grows.
- Add edge function/webhook for email/Slack paging on P1/P2 tickets.
