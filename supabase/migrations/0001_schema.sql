-- STAT41120 Sprint — schema
-- Run in Supabase SQL editor (or supabase db push)

create extension if not exists pgcrypto;

-- A. profiles ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz default now()
);

-- auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- B. app_state (visited, sprintChecks, formulaProgress, seededWrongNotes, uiPreferences)
create table if not exists public.app_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  unique (user_id, key)
);

-- C. drill_attempts ----------------------------------------------------------
create table if not exists public.drill_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  drill_id text,
  topic text,
  weakness_type text,
  question text,
  user_answer text,
  mark text check (mark in ('Correct','Partially correct','Incorrect')),
  model_answer text,
  rule text,
  hook text,
  trigger text,
  created_at timestamptz default now()
);
create index if not exists drill_attempts_user_idx on public.drill_attempts (user_id, created_at desc);

-- D. wrong_notes (오답노트) ---------------------------------------------------
create table if not exists public.wrong_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_id text,            -- drill id (qid) or seed id
  topic text not null,
  weakness_type text,
  wrong text,
  rule text,
  hook text,
  trigger text,
  source text,
  count integer default 1,
  correct_streak integer default 0,
  last_seen_at timestamptz default now(),
  due_at timestamptz default now(),
  mastered boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists wrong_notes_user_idx on public.wrong_notes (user_id, mastered, due_at);

-- E. saved_answers (free-responses, CNN calculations) ------------------------
create table if not exists public.saved_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text,               -- 'drill-free' | 'cnn-calculator'
  topic text,
  question text,
  user_answer text,
  model_answer text,
  mark text,
  created_at timestamptz default now()
);
create index if not exists saved_answers_user_idx on public.saved_answers (user_id, created_at desc);
