# start-docker-compose.ps1

$dockerDesktopPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Función para eliminar contenedores existentes
function Remove-Containers {
    Write-Host "Eliminando contenedores existentes si hay..."
    $containers = docker ps -aq
    if ($containers) {
        docker rm -f $containers | Out-Null
        Write-Host "Contenedores eliminados."
    } else {
        Write-Host "No hay contenedores previos."
    }
}

# Iniciar Docker Desktop si no está corriendo
$dockerProcess = Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue
if (-not $dockerProcess) {
    Write-Host "Iniciando Docker Desktop..."
    Start-Process -FilePath $dockerDesktopPath
}

# Esperar a que Docker esté disponible
Write-Host "Esperando a que Docker esté listo..."
$maxRetries = 20
$retry = 0
while ($retry -lt $maxRetries) {
    try {
        docker info > $null 2>&1
        if ($LASTEXITCODE -eq 0) { break }
    } catch {}
    Start-Sleep -Seconds 3
    $retry++
}

# Eliminar contenedores previos
Remove-Containers

# Levantar contenedores en modo detached sin borrar volúmenes
Write-Host "Levantando contenedores (Postgres + Backend + Frontend)..."
docker-compose -f docker/docker-compose.yml up -d --build

# Esperar a que PostgreSQL esté listo
function Wait-Postgres {
    Write-Host "Esperando a que PostgreSQL esté listo..."
    $maxRetries = 20
    $retry = 0
    while ($retry -lt $maxRetries) {
        try {
            docker exec gastos-postgres pg_isready -U postgres
            if ($LASTEXITCODE -eq 0) {
                Write-Host "PostgreSQL está listo."
                return $true
            }
        } catch {}
        Start-Sleep -Seconds 3
        $retry++
    }
    Write-Host "PostgreSQL no se pudo iniciar después de esperar."
    return $false
}

Wait-Postgres

# Mostrar logs del backend en modo attached para depuración
Write-Host "Mostrando logs del backend (Ctrl+C para detener)..."
docker-compose -f docker/docker-compose.yml logs -f backend
