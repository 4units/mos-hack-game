-include .env
export

DOCS_DIR := ../../mos-hack-game-api/docs

generate-secrets:
	openssl genrsa -out secrets/chat-server.rsa
	openssl rsa -in secrets/chat-server.rsa -pubout > secrets/chat-server.rsa.pub

run:
	RUN_MIGRATIONS=true docker compose --env-file .env up -d --build

run-without-migrations:
	docker compose --env-file .env up -d --build

migration-up:
	@migrate -database $(DB_LOCAL_URL) -path $(MIGRATIONS_DIR) up

migration-down:
	@migrate -database $(DB_LOCAL_URL) -path $(MIGRATIONS_DIR) down

migration-force:
	@migrate -database $(DB_LOCAL_URL) -path $(MIGRATIONS_DIR) force 1

migration-version:
	@migrate -database $(DB_LOCAL_URL) -path $(MIGRATIONS_DIR) version

create-migration:
	@if [ -z "$(name)" ]; then \
		echo "Need argument 'name=...'" && exit 1; \
	fi
	@migrate create -ext sql -dir $(MIGRATIONS_DIR) -seq $(name)