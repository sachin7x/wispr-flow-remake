#!/usr/bin/env sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT"
command -v python3 >/dev/null 2>&1 || { echo "python3 is required" >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js is required" >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required" >&2; exit 1; }
python3 -m venv apps/api/.venv
apps/api/.venv/bin/python -m pip install --upgrade pip
apps/api/.venv/bin/pip install -e "apps/api[dev]"
(cd apps/web && npm install)
printf '\nSetup complete. Run: make verify\nStart everything with Docker: docker compose up --build\n'
