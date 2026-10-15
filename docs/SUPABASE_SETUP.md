# Supabase integration

Project: wispr-flow-remake in Fabricsg, Mumbai (ap-south-1).

## Configured
- Browser-safe project URL and publishable key are configured in the Vercel frontend project for production, preview, and development.
- Email OTP / magic-link sign-in is wired through @supabase/ssr and /auth/callback.
- user_preferences and dictation_sessions exist with RLS enabled, grants restricted to authenticated users, and per-user CRUD policies.
- The service-role/secret key is not used in the browser.

## Supabase Auth dashboard checks
Before testing a real sign-in, add https://wispr-flow-remake.vercel.app/auth/callback and http://localhost:3000/auth/callback to Supabase Auth's allowed redirect URLs. Confirm the email provider is enabled. The default email service may be rate-limited; configure SMTP before inviting real users.

## Verify
Run list_tables, list_migrations, and the security/performance advisors. Confirm RLS is enabled on both tables and every policy compares user_id with (select auth.uid()). Do not test cross-user isolation using production user data.
