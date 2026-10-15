# Flow Remake

Clean-room voice-dictation project scaffold. This project does not contain Wispr Flow proprietary source.

## Quick start

### One command (Docker)

```sh
docker compose up --build
```

Open the web UI at http://localhost:3000 and API health at http://localhost:8000/health. The UI currently accepts manual text; microphone capture and real speech recognition are not connected yet.

### Native development

Prerequisites: Python 3.11+, Node.js 20+, npm. Then:

```sh
make setup
make verify
```

Start the API with `cd apps/api && .venv/bin/uvicorn app.main:app --reload --port 8000`; in a second terminal run `cd apps/web && npm run dev`.

## Agent setup

Read `AGENTS.md` first. Claude Code instructions are in `CLAUDE.md`; Codex uses `AGENTS.md` and `CODEX.md`. See `docs/AGENT_SETUP.md` for exact commands and credential safety.

## Components

- `apps/web`: Next.js frontend, same-origin formatting API, Supabase magic-link UI and callback
- `apps/api`: FastAPI formatting API
- `supabase/migrations`: user-scoped PostgreSQL schema and RLS
- `docs`: architecture, implementation plan, privacy/security and integration instructions
- `.github/workflows/ci.yml`: frontend, backend and Docker Compose smoke tests

## Current integration status

Implemented in code: dashboard, deterministic formatting, health endpoint, explicit 501 when ASR is absent, Supabase browser/server clients, email OTP/magic-link sign-in flow, callback exchange, initial schema, RLS policies, CI and agent instructions.

Configured: separate Supabase project in Mumbai; frontend Vercel environment variables for Supabase URL and publishable key.

Still requires dashboard/configuration or further implementation: add production and localhost callback URLs to Supabase Auth's allowed redirect URLs; verify email delivery; use authenticated database operations from application screens; add microphone capture, real ASR, native global shortcut/text insertion, cloud sync, billing and Notetaker. Authenticated CRUD API endpoints are not implemented yet. Do not treat this scaffold as production-ready.
