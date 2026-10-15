# Flow Remake

Clean-room, functionally comparable voice-dictation platform scaffold. This project does not contain Wispr Flow proprietary source.

## Monorepo
- `apps/web`: Next.js frontend
- `apps/api`: FastAPI backend
- `supabase/migrations`: PostgreSQL schema and row-level security
- `docs`: architecture, implementation plan and privacy baseline
- `.github/workflows/ci.yml`: CI starter

## Status
The dashboard and deterministic formatting prototype are implemented in this scaffold. Microphone capture, ASR provider integration, native system-wide insertion, authenticated private routes, subscriptions, sync, and Notetaker remain unimplemented. The API deliberately does not fake successful transcription.

## Run
API: `cd apps/api && python -m venv .venv && source .venv/bin/activate && pip install -e '.[dev]' && uvicorn app.main:app --reload --port 8000`
Web: `cd apps/web && npm install && npm run dev`
API tests: `cd apps/api && pytest`

Copy `.env.example` to `.env` for local development. Never commit secrets. Tests/builds have not been run as part of generating this scaffold.
