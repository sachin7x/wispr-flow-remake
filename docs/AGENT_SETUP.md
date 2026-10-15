# Agent setup: Claude Code and Codex

## Prerequisites
- Python 3.11 or newer
- Node.js 20 or newer and npm
- Docker Desktop / Docker Engine + Compose for one-command container startup
- Optional: Supabase project and an explicitly selected ASR provider. The current code does not require credentials to run its local formatting demo.

## One-command local stack
```sh
docker compose up --build
```
Open the frontend at http://localhost:3000 and API health at http://localhost:8000/health. The demo accepts manually entered text. Speech-to-text is intentionally unavailable until an ASR provider is selected and implemented.

## Native setup
```sh
make setup
make verify
```
Start the API in one terminal with `cd apps/api && .venv/bin/uvicorn app.main:app --reload --port 8000`, and the web UI in another with `cd apps/web && npm run dev`.

## Secrets
Copy `.env.example` to `.env` only when needed. Do not commit real credentials. Never put service-role keys in browser environment variables. Do not paste secrets into agent prompts or commit logs.

## Connected services
- GitHub: source and CI.
- Vercel: frontend project, Git-linked.
- Supabase: separate project creation and schema application require explicit confirmation.
- ASR: not yet configured; choose a provider only after comparing retention, region, latency, security, and cost.
