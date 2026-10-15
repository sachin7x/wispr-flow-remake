# Deployment topology

## Vercel projects
- `wispr-flow-remake`: Next.js frontend, root directory `apps/web`.
- `wispr-flow-remake-api`: FastAPI backend, root directory `apps/api`.
- Both projects are connected to the GitHub repository. Pushes to the configured Git branch should trigger deployments; verify each deployment status and URL rather than assuming the hook ran.
- Production serverless region is configured to Mumbai (`bom1`) where supported.

## Environment
Frontend: `NEXT_PUBLIC_API_BASE_URL` must be the deployed API origin at build time. Never put secrets in `NEXT_PUBLIC_*` variables.

API: `CORS_ORIGINS` must contain the exact deployed frontend origin. Keep development and production values separate.

## Deployment verification
1. Confirm GitHub Actions CI passes for the exact commit.
2. Confirm the frontend deployment reaches READY and returns HTTP 200.
3. Confirm API `/health` returns HTTP 200 and identifies ASR as not configured until a provider is implemented.
4. Confirm frontend `/v1/format` request succeeds through the configured API origin.
5. Confirm `/v1/transcriptions` returns an explicit not-configured response, not fake transcription.
6. Do not call this production-ready until authentication, real ASR, Supabase integration, rate limiting, retention, deletion and end-to-end tests are complete.
