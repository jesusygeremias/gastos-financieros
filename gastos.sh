#!/bin/bash

DOCKER_COMPOSE_FILE="docker/docker-compose.yml"
PROJECT_NAME="gastos"  # Nombre del proyecto para filtrar contenedores e imágenes

# Función para eliminar contenedores del proyecto
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

# Función para eliminar imágenes del proyecto
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

# Función que se ejecuta al presionar Ctrl+C
cleanup() {
    echo
    echo "Ctrl+C detectado, eliminando contenedores del proyecto antes de salir..."
    remove_project_containers
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Verificar que Docker esté corriendo
echo "Comprobando si Docker está disponible..."
max_retries=20
retry=0
until docker info >/dev/null 2>&1; do
    if [ $retry -ge $max_retries ]; then
        echo "Docker no está disponible después de esperar."
        exit 1
    fi
    echo "Esperando a que Docker esté listo..."
    sleep 3
    retry=$((retry+1))
done
echo "Docker está listo."

# Limpiar imágenes y contenedores previos del proyecto
remove_project_containers
remove_project_images

# Levantar contenedores en modo detached sin borrar volúmenes
echo "Levantando contenedores (Postgres + Backend + Frontend)..."
docker compose -f "$DOCKER_COMPOSE_FILE" -p $PROJECT_NAME up -d --build

# Esperar a que PostgreSQL esté listo
wait_postgres() {
    echo "Esperando a que PostgreSQL esté listo..."
    max_retries=20
    retry=0
    while [ $retry -lt $max_retries ]; do
        docker exec ${PROJECT_NAME}-postgres pg_isready -U postgres >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "PostgreSQL está listo."
            return 0
        fi
        sleep 3
        retry=$((retry+1))
    done
    echo "PostgreSQL no se pudo iniciar después de esperar."
    return 1
}

wait_postgres

# Mostrar logs del backend en modo attached para depuración
echo "Mostrando logs del backend (Ctrl+C para detener y borrar contenedores)..."
docker compose -f "$DOCKER_COMPOSE_FILE" -p $PROJECT_NAME logs -f backend
