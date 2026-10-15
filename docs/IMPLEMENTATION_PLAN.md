# Implementation plan

## P0 Foundation
- [x] Frontend/backend monorepo structure
- [x] FastAPI health endpoint
- [x] Deterministic formatting prototype and unit tests
- [x] Initial Supabase schema with RLS
- [ ] Create remote GitHub repository and verify CI
- [ ] Validate Supabase JWTs for private API routes

## P1 Core dictation
- [ ] Select ASR provider and document processing/retention terms
- [ ] Audio upload/streaming contract with MIME, size, and duration limits
- [ ] Native macOS capture and global shortcut
- [ ] Focused-app insertion, permission UX, undo and recovery
- [ ] End-to-end sample audio tests

## P2 Context and formatting
- [ ] Explicit context permission and per-app exclusions
- [ ] Treat application content as untrusted
- [ ] Email, work-chat, personal-chat and other categories
- [ ] Golden tests for names, numbers, negation, code identifiers and URLs

## P3 Personalization
- [ ] Dictionary, replacements, snippets, styles and precedence rules
- [ ] Optional sync with account isolation tests

## P4 Privacy and reliability
- [ ] Threat model, retention and deletion tests
- [ ] Instrumented network-egress tests for local-only mode
- [ ] Retry idempotency and duplicate-insertion tests
- [ ] p50/p95 latency on a fixed reference setup

## P5 Release
- [ ] Notetaker only after core dictation gates pass
- [ ] Signed installers, rollback and cross-platform QA
- [ ] Evidence-backed replication report

Proposed targets, not measured results: >=99% supported-app insertion success; zero duplicate insertions in retry suite; >=99% critical identifier preservation; >=99.5% reviewed critical-negation preservation; p95 <=700ms after speech end on a defined setup; zero prohibited transfers in local-only mode.
