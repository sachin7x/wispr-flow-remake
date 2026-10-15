# Privacy and security baseline

- Separate consent for cloud ASR, context awareness, cloud sync, and model training.
- Minimize captured context; exclude password fields and sensitive targets.
- Treat app/web content as untrusted input, never policy instructions.
- Do not log raw audio or transcript by default.
- Define retention/deletion independently for audio, raw text, formatted text and diagnostics.
- Keep service-role credentials server-side.
- Apply verified identity and RLS to every user-owned record.
- Limit audio size, duration, MIME types, rate and processing time.
- Use idempotency keys for session and insertion operations.
- Prove local-only claims with outbound network tests, not a UI toggle.
- Before launch: dependency/secret scanning, SAST, auth/RLS integration tests and manual threat-model review.
