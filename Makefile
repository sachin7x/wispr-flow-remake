SHELL := /bin/sh
.PHONY: help setup api-test web-install web-lint web-build verify up down clean
help:
	@echo "make setup       Install local API and web dependencies"
	@echo "make verify      Run API tests, web lint and production build"
	@echo "make up          Start the complete local stack with Docker Compose"
	@echo "make down        Stop the local stack"
setup:
	python3 -m venv apps/api/.venv
	apps/api/.venv/bin/python -m pip install --upgrade pip
	apps/api/.venv/bin/pip install -e "apps/api[dev]"
	cd apps/web && npm install
api-test:
	cd apps/api && .venv/bin/python -m pytest -q
web-install:
	cd apps/web && npm install
web-lint:
	cd apps/web && npm run lint
web-build:
	cd apps/web && npm run build
verify: api-test web-lint web-build
up:
	docker compose up --build
down:
	docker compose down
clean:
	rm -rf apps/api/.venv apps/web/node_modules apps/web/.next
