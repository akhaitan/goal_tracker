-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard > SQL Editor)

create table if not exists goals (
  id uuid primary key,
  username text not null,
  name text not null,
  type text not null check (type in ('cumulative', 'absolute', 'streak')),
  target numeric,
  unit text default '',
  start_value numeric,
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  created_at timestamptz not null default now()
);

create table if not exists entries (
  id uuid primary key,
  goal_id uuid not null references goals(id) on delete cascade,
  value numeric not null,
  date date not null,
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_goals_username on goals(username);
create index if not exists idx_goals_visibility on goals(visibility);
create index if not exists idx_entries_goal_id on entries(goal_id);

-- Enable RLS
alter table goals enable row level security;
alter table entries enable row level security;

-- Allow anon read/write (username-only auth, no real auth)
create policy "Anyone can read public goals" on goals
  for select using (visibility = 'public');

create policy "Anyone can read own goals" on goals
  for select using (true);

create policy "Anyone can insert goals" on goals
  for insert with check (true);

create policy "Anyone can update goals" on goals
  for update using (true);

create policy "Anyone can delete goals" on goals
  for delete using (true);

create policy "Anyone can read entries" on entries
  for select using (true);

create policy "Anyone can insert entries" on entries
  for insert with check (true);

create policy "Anyone can delete entries" on entries
  for delete using (true);
