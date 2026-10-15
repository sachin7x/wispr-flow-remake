drop policy "users read own preferences" on public.user_preferences;
drop policy "users insert own preferences" on public.user_preferences;
drop policy "users update own preferences" on public.user_preferences;
drop policy "users delete own preferences" on public.user_preferences;
drop policy "users read own sessions" on public.dictation_sessions;
drop policy "users create own sessions" on public.dictation_sessions;
drop policy "users update own sessions" on public.dictation_sessions;
drop policy "users delete own sessions" on public.dictation_sessions;

create policy "users read own preferences" on public.user_preferences for select to authenticated using ((select auth.uid())=user_id);
create policy "users insert own preferences" on public.user_preferences for insert to authenticated with check ((select auth.uid())=user_id);
create policy "users update own preferences" on public.user_preferences for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "users delete own preferences" on public.user_preferences for delete to authenticated using ((select auth.uid())=user_id);

create policy "users read own sessions" on public.dictation_sessions for select to authenticated using ((select auth.uid())=user_id);
create policy "users create own sessions" on public.dictation_sessions for insert to authenticated with check ((select auth.uid())=user_id);
create policy "users update own sessions" on public.dictation_sessions for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "users delete own sessions" on public.dictation_sessions for delete to authenticated using ((select auth.uid())=user_id);
