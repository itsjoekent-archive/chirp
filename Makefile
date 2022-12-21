SHELL := /bin/bash

start-dev-resources:
	docker-compose -f resources.compose.yml build
	docker-compose -f resources.compose.yml up --detach

dev:
	source $(HOME)/.nvm/nvm.sh && nvm use
	npm ci
	npm run build --workspaces
	make start-dev-resources
	./cli/index.js --command run-all --npm dev

stop-dev-resources:
	docker-compose -f resources.compose.yml down
