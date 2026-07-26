-- STAT41120 Sprint — Row Level Security

alter table public.profiles enable row level security;
alter table public.app_state enable row level security;
alter table public.drill_attempts enable row level security;
alter table public.wrong_notes enable row level security;
alter table public.saved_answers enable row level security;

-- profiles: own row only (auth.uid() = id)
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- app_state
create policy "app_state_select_own" on public.app_state for select using (auth.uid() = user_id);
create policy "app_state_insert_own" on public.app_state for insert with check (auth.uid() = user_id);
create policy "app_state_update_own" on public.app_state for update using (auth.uid() = user_id);
create policy "app_state_delete_own" on public.app_state for delete using (auth.uid() = user_id);

-- drill_attempts
create policy "drill_attempts_select_own" on public.drill_attempts for select using (auth.uid() = user_id);
create policy "drill_attempts_insert_own" on public.drill_attempts for insert with check (auth.uid() = user_id);
create policy "drill_attempts_update_own" on public.drill_attempts for update using (auth.uid() = user_id);
create policy "drill_attempts_delete_own" on public.drill_attempts for delete using (auth.uid() = user_id);

-- wrong_notes
create policy "wrong_notes_select_own" on public.wrong_notes for select using (auth.uid() = user_id);
create policy "wrong_notes_insert_own" on public.wrong_notes for insert with check (auth.uid() = user_id);
create policy "wrong_notes_update_own" on public.wrong_notes for update using (auth.uid() = user_id);
create policy "wrong_notes_delete_own" on public.wrong_notes for delete using (auth.uid() = user_id);

-- saved_answers
create policy "saved_answers_select_own" on public.saved_answers for select using (auth.uid() = user_id);
create policy "saved_answers_insert_own" on public.saved_answers for insert with check (auth.uid() = user_id);
create policy "saved_answers_update_own" on public.saved_answers for update using (auth.uid() = user_id);
create policy "saved_answers_delete_own" on public.saved_answers for delete using (auth.uid() = user_id);
