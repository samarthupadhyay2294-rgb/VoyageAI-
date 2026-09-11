.PHONY: help build up down restart logs clean install-backend install-frontend test-backend test-frontend lint-backend lint-frontend

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker containers
	docker compose build

up: ## Start all services
	docker compose up -d

down: ## Stop all services
	docker compose down

restart: ## Restart all services
	docker compose restart

logs: ## View logs from all services
	docker compose logs -f

clean: ## Stop and remove all containers, volumes, and networks
	docker compose down -v
	docker system prune -f

install-backend: ## Install backend dependencies
	cd backend && python -m venv venv
	cd backend && source venv/bin/activate && pip install -r requirements.txt

install-backend-windows: ## Install backend dependencies on Windows PowerShell
	cd backend && py -3 -m venv venv
	cd backend && powershell -NoProfile -ExecutionPolicy Bypass -Command ". \"./venv/Scripts/Activate.ps1\"; pip install -r requirements.txt"

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

test-backend: ## Run backend tests
	cd backend && pytest

test-frontend: ## Run frontend tests
	cd frontend && npm test

lint-backend: ## Lint backend code
	cd backend && black app/
	cd backend && ruff check app/

lint-frontend: ## Lint frontend code
	cd frontend && npm run lint

format-backend: ## Format backend code
	cd backend && black app/
	cd backend && ruff check --fix app/

format-frontend: ## Format frontend code
	cd frontend && npm run format

dev-backend: ## Start backend in development mode
	cd backend && source venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-backend-windows: ## Start backend in development mode on Windows PowerShell
	cd backend && powershell -NoProfile -ExecutionPolicy Bypass -Command ". \"./venv/Scripts/Activate.ps1\"; py -3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

dev-frontend: ## Start frontend in development mode
	cd frontend && npm run dev
