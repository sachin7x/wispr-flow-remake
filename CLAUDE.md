# Claude Code Instructions

Read `AGENTS.md` first. It is the shared source of truth for repository rules.

## Workflow
- Inspect source, tests, branch, and git status before modifying anything.
- Make a short plan for non-trivial changes and implement in small verified steps.
- Run `make verify` before reporting completion. If Docker is unavailable, run API and web checks separately and say exactly what could not run.
- Do not install global packages or alter the user's machine without permission.
- Never use production credentials in tests; use environment placeholders or isolated test resources.
- Never apply a database migration to a real Supabase project without explicit user approval.
- Never deploy or promote to production without explicit user approval.
- Keep the implementation clean-room and independent.
