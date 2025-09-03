#!/bin/bash

DOCKER_COMPOSE_FILE="docker/docker-compose.yml"
PROJECT_NAME="gastos"

remove_project_containers() {
    echo "Eliminando contenedores del proyecto '$PROJECT_NAME'..."
    containers=$(docker ps -aq --filter "name=${PROJECT_NAME}")
    if [ -n "$containers" ]; then
        docker rm -f $containers >/dev/null 2>&1
        echo "Contenedores eliminados."
    else
        echo "No hay contenedores previos del proyecto."
    fi
}

remove_project_images() {
    echo "Eliminando imágenes del proyecto '$PROJECT_NAME'..."
    images=$(docker images --format "{{.Repository}}:{{.Tag}} {{.ID}}" | grep "$PROJECT_NAME" | awk '{print $2}')
    if [ -n "$images" ]; then
        docker rmi -f $images >/dev/null 2>&1
        echo "Imágenes eliminadas."
    else
        echo "No hay imágenes previas del proyecto."
    fi
}

cleanup() {
    echo
    echo "Ctrl+C detectado, eliminando contenedores del proyecto..."
    remove_project_containers
    exit 0
}

trap cleanup SIGINT

echo "Comprobando si Docker está disponible..."
max_retries=20
retry=0
until docker info >/dev/null 2>&1; do
    if [ $retry -ge $max_retries ]; then
        echo "Docker no está disponible."
        exit 1
    fi
    echo "Esperando a Docker..."
    sleep 3
    retry=$((retry+1))
done
echo "Docker listo."

remove_project_containers
remove_project_images

echo "Levantando contenedores (Postgres + Backend + Frontend HTTPS)..."
docker compose -f "$DOCKER_COMPOSE_FILE" -p $PROJECT_NAME up -d --build

wait_postgres() {
    echo "Esperando PostgreSQL..."
    max_retries=20
    retry=0
    while [ $retry -lt $max_retries ]; do
        docker exec ${PROJECT_NAME}-postgres pg_isready -U postgres >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "PostgreSQL listo."
            return 0
        fi
        sleep 3
        retry=$((retry+1))
    done
    echo "PostgreSQL no respondió."
    return 1
}

wait_postgres

echo "Mostrando logs del backend y frontend (Ctrl+C para detener)..."
docker compose -f "$DOCKER_COMPOSE_FILE" -p $PROJECT_NAME logs -f backend frontend
