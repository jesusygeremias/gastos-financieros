#!/bin/bash

DOCKER_COMPOSE_FILE="docker/docker-compose.yml"

echo "Deteniendo contenedores..."
docker compose -f "$DOCKER_COMPOSE_FILE" down
echo "Contenedores detenidos."
