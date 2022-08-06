redis:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1  docker-compose -f docker-compose.yml up -d --build redis-stack

generate:
	yarn generate
	
.PHONY: redis generate