-- Run this in your Supabase project (SQL Editor) to create the table.
-- Go to https://supabase.com/dashboard, create a project, then run this SQL.

create table if not exists public.records (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('expense', 'bill', 'savings', 'installment', 'income')),
  amount decimal not null check (amount >= 0),
  category text not null default '',
  label text not null default '',
  date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Allow all operations for the anon key (for a single-user app).
-- For production with auth, replace with RLS policies per user.
alter table public.records enable row level security;

create policy "Allow all for anon"
  on public.records
  for all
  to anon
  using (true)
  with check (true);

-- Optional: updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_records_updated_at
  before update on public.records
  for each row execute function public.set_updated_at();
