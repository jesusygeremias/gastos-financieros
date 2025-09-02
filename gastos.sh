#!/bin/bash

DOCKER_COMPOSE_FILE="docker/docker-compose.yml"

# Función para eliminar contenedores existentes
remove_containers() {
    echo "Eliminando contenedores existentes si hay..."
    containers=$(docker ps -aq)
    if [ -n "$containers" ]; then
        docker rm -f $containers >/dev/null 2>&1
        echo "Contenedores eliminados."
    else
        echo "No hay contenedores previos."
    fi
}

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

# Eliminar contenedores previos
remove_containers

# Levantar contenedores en modo detached sin borrar volúmenes
echo "Levantando contenedores (Postgres + Backend + Frontend)..."
docker-compose -f "$DOCKER_COMPOSE_FILE" up -d --build

# Esperar a que PostgreSQL esté listo
wait_postgres() {
    echo "Esperando a que PostgreSQL esté listo..."
    max_retries=20
    retry=0
    while [ $retry -lt $max_retries ]; do
        docker exec gastos-postgres pg_isready -U postgres >/dev/null 2>&1
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
echo "Mostrando logs del backend (Ctrl+C para detener)..."
docker-compose -f "$DOCKER_COMPOSE_FILE" logs -f backend
