# Windows: requires Docker Desktop running. If commands hang, restart Docker Desktop.
COMPOSE := docker compose
ENV_FILE := .env

ifneq (,$(wildcard $(ENV_FILE)))
COMPOSE += --env-file $(ENV_FILE)
endif

.SHELLFLAGS := -c

.PHONY: help env build install up up-fresh down restart ps doctor logs \
	backend-logs client-logs admin-logs db-logs \
	migrate makemigrations shell createsuperuser seed \
	backend-shell client-shell admin-shell rebuild clean \
	client-deps admin-deps deps wait

help: ## Show available commands
	@echo.
	@echo   make env              Copy .env.docker.example to .env
	@echo   make install          npm ci (host) - run after package.json changes
	@echo   make build            Build all Docker images
	@echo   make up               Start services and wait until URLs work
	@echo   make up-fresh         Recreate containers (after compose changes)
	@echo   make doctor           Diagnose port bindings
	@echo   make down             Stop containers
	@echo   make ps               List containers
	@echo   make restart          down then up
	@echo   make clean            Stop and remove volumes (deletes DB)
	@echo.
	@echo   Tip: If make hangs, open Docker Desktop and wait until it is ready.
	@echo   Or run directly: docker compose --env-file .env down
	@echo.

env: ## Copy Docker env example to .env
	@if exist .env (echo .env already exists) else (copy .env.docker.example .env && echo Created .env)

build: ## Build all Docker images
	@echo [make] Building images...
	@$(COMPOSE) build
	@echo [make] Build finished.

install: ## Install npm deps on host (for client/admin)
	@echo [make] Installing client dependencies...
	@cd ecommerce_client && npm ci
	@echo [make] Installing admin dependencies...
	@cd ecommerce_admin && npm ci
	@echo [make] Install finished. Run "make up" to start Docker.

up: ## Start all services and wait until URLs respond
	@echo [make] Starting containers...
	@$(COMPOSE) up -d
	@$(MAKE) wait

up-fresh: ## Recreate containers (use after compose/port changes)
	@echo [make] Recreating containers...
	@$(COMPOSE) up -d --force-recreate
	@$(MAKE) wait

wait: ## Wait until store, admin, and API respond on host ports
	@powershell -NoProfile -ExecutionPolicy Bypass -File scripts/wait-for-services.ps1

doctor: ## Show port bindings and quick HTTP checks
	@echo [make] Container ports:
	@$(COMPOSE) ps
	@echo.
	@docker port macquul_system-client-1 2>nul || echo client: not running
	@docker port macquul_system-admin-1 2>nul || echo admin: not running
	@docker port macquul_system-backend-1 2>nul || echo backend: not running

down: ## Stop and remove containers
	@echo [make] Stopping containers (waiting for Docker Desktop)...
	@$(COMPOSE) down --remove-orphans
	@echo [make] Stopped.

restart: down up ## Restart all services

ps: ## List running containers
	@echo [make] Container status:
	@$(COMPOSE) ps -a

logs: ## Follow logs for all services
	@$(COMPOSE) logs -f

backend-logs: ## Follow backend logs
	@$(COMPOSE) logs -f backend

client-logs: ## Follow client (storefront) logs
	@$(COMPOSE) logs -f client

admin-logs: ## Follow admin panel logs
	@$(COMPOSE) logs -f admin

db-logs: ## Follow PostgreSQL logs
	@$(COMPOSE) logs -f db

migrate: ## Run Django migrations
	@$(COMPOSE) exec backend python manage.py migrate

makemigrations: ## Create new Django migrations
	@$(COMPOSE) exec backend python manage.py makemigrations

shell: ## Open Django shell
	@$(COMPOSE) exec backend python manage.py shell

createsuperuser: ## Create Django admin user
	@$(COMPOSE) exec backend python manage.py createsuperuser

seed: ## Load sample products and data
	@$(COMPOSE) exec backend python manage.py seed_sample_data

backend-shell: ## Open a shell in the backend container
	@$(COMPOSE) exec backend sh

client-shell: ## Open a shell in the client container
	@$(COMPOSE) exec client sh

admin-shell: ## Open a shell in the admin container
	@$(COMPOSE) exec admin sh

rebuild: ## Rebuild images and restart services
	@echo [make] Rebuilding and starting...
	@$(COMPOSE) up -d --build
	@$(MAKE) wait

client-deps: ## Install npm packages in client container
	@$(COMPOSE) exec client npm install

admin-deps: ## Install npm packages in admin container
	@$(COMPOSE) exec admin npm install

deps: client-deps admin-deps ## Install npm packages in frontend containers

clean: ## Stop containers and remove volumes (deletes DB data)
	@echo [make] Stopping and removing volumes...
	@$(COMPOSE) down -v --remove-orphans
	@echo [make] Clean finished.
