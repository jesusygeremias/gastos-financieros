# stop-docker-compose.ps1
Write-Host "Deteniendo contenedores..."
docker-compose -f docker/docker-compose.yml down
Write-Host "Contenedores detenidos."
