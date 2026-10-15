# Architecture

## Request path
1. Native client requests explicit microphone permission and captures audio.
2. ASR adapter returns a raw transcript and provider/model metadata.
3. Preserve immutable raw text before edits.
4. Apply deterministic corrections and constrained formatting.
5. Require review when confidence is low or the action is high risk.
6. Native insertion adapter inserts into the focused app with deduplicated retries and undo.

## Trust boundaries
- App context is untrusted data, never instructions.
- Audio and transcript are sensitive.
- Cloud ASR, context awareness, cloud sync, and training consent are separate controls.
- Do not log raw audio/transcript by default.
- Service-role keys never ship to a client.
- Authenticate JWTs before any private session route. The scaffold has no private session routes yet.

## Implemented boundary
Web dashboard and deterministic formatting API are starter prototypes. Microphone capture, ASR provider, native insertion, auth middleware, billing, sync, and Notetaker are not implemented.
