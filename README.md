# Flow Remake

Clean-room voice-dictation project scaffold. This project does not contain Wispr Flow proprietary source.

## Quick start

### One command (Docker)

```sh
docker compose up --build
```

Open the web UI at http://localhost:3000 and API health at http://localhost:8000/health. The current UI accepts manual text; microphone capture and ASR are not connected yet.

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

- `apps/web`: Next.js frontend
- `apps/api`: FastAPI formatting API
- `supabase/migrations`: user-scoped PostgreSQL schema and RLS
- `docs`: architecture, implementation plan, privacy/security, agent setup
- `.github/workflows/ci.yml`: frontend and backend CI

## Honest status

Implemented: dashboard, deterministic formatting endpoint, health endpoint, explicit 501 response while ASR is absent, initial Supabase schema, RLS, CI, agent instructions and local stack definitions.

Not implemented yet: microphone capture, real ASR adapter, native global shortcut/text insertion, authentication middleware, real Supabase client integration, cloud sync, billing and Notetaker. Do not treat the current scaffold as production-ready. Do not enter production credentials into local demos.
