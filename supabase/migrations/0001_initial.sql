create extension if not exists pgcrypto;
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  vocabulary jsonb not null default '[]'::jsonb,
  replacements jsonb not null default '[]'::jsonb,
  snippets jsonb not null default '[]'::jsonb,
  styles jsonb not null default '[]'::jsonb,
  context_awareness_enabled boolean not null default false,
  cloud_sync_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);
create table if not exists public.dictation_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('created','processing','completed','failed','cancelled')),
  target_app_category text check (target_app_category in ('email','work_messaging','personal_messaging','other')),
  raw_transcript text,
  formatted_transcript text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  check ((raw_transcript is null or char_length(raw_transcript)<=30000) and (formatted_transcript is null or char_length(formatted_transcript)<=30000))
);
alter table public.user_preferences enable row level security;
alter table public.dictation_sessions enable row level security;
create policy "users read own preferences" on public.user_preferences for select to authenticated using (auth.uid()=user_id);
create policy "users insert own preferences" on public.user_preferences for insert to authenticated with check (auth.uid()=user_id);
create policy "users update own preferences" on public.user_preferences for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "users delete own preferences" on public.user_preferences for delete to authenticated using (auth.uid()=user_id);
create policy "users read own sessions" on public.dictation_sessions for select to authenticated using (auth.uid()=user_id);
create policy "users create own sessions" on public.dictation_sessions for insert to authenticated with check (auth.uid()=user_id);
create policy "users update own sessions" on public.dictation_sessions for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "users delete own sessions" on public.dictation_sessions for delete to authenticated using (auth.uid()=user_id);
create index if not exists dictation_sessions_user_created_idx on public.dictation_sessions(user_id, created_at desc);
revoke all on public.user_preferences from anon, authenticated;
revoke all on public.dictation_sessions from anon, authenticated;
grant select, insert, update, delete on public.user_preferences to authenticated;
grant select, insert, update, delete on public.dictation_sessions to authenticated;
grant usage on schema public to authenticated;
