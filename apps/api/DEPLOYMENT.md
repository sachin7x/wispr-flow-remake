# API deployment

This directory is deployed as the `wispr-flow-remake-api` Vercel project. The ASGI entrypoint is `api/index.py`; route implementations live in `app/main.py`.

Required environment variable: `CORS_ORIGINS`, set to the deployed frontend origin and local development origin as appropriate. No Supabase credentials or ASR keys are required for the current demo endpoints. Do not expose service-role keys.

`GET /health` reports service and ASR configuration. `POST /v1/transcriptions` deliberately returns 501 until a real ASR provider is implemented and configured.
