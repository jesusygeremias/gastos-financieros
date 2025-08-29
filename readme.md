# Dashboard Financiero

Aplicación web para la gestión de gastos e ingresos personales, con visualización de saldos por cuenta, gráficos y soporte para inserción masiva de gastos.

## Características

- Registro y edición de gastos e ingresos.
- Cálculo automático de saldos por cuenta.
- Inserción masiva de gastos predefinidos (“Cargar por defecto”).
- Visualización de distribución de saldos con gráficos.
- Totalmente dockerizado para frontend y backend.
- Estilos modernos con TailwindCSS y componentes React.

## Tecnologías

- **Frontend:** React 18, Recharts, TailwindCSS.
- **Backend:** Spring Boot (Java), REST API.
- **Base de datos:** PostgreSQL.
- **Contenerización:** Docker, Docker Compose.

## Estructura del proyecto

```
gastos-financieros/
├── backend/              # Backend Spring Boot
│   ├── src/
│   ├── Dockerfile
│   └── ...
├── frontend/             # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   └── ...
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker/               # Configuración Docker Compose y scripts
│   ├── docker-compose.yml
│   └── sql/init.sql
└── README.md
```

## Requisitos

- Docker >= 24
- Docker Compose >= 2.20
- Node.js >= 20 (solo para desarrollo local si no se usa Docker)

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <REPO_URL>
cd gastos-financieros
```

### 2. Construir y levantar contenedores

```bash
docker-compose up --build
```

Esto levantará:

- **Frontend:** `http://localhost:3000` (React + Tailwind)
- **Backend:** `http://localhost:8080` (Spring Boot)
- **Base de datos PostgreSQL:** puerto 5432

### 3. Uso

- Abrir el navegador en `http://localhost:3000`.
- Añadir gastos e ingresos manualmente o cargar gastos por defecto.
- Visualizar saldos y distribución por cuenta.
- Guardar los movimientos se reflejará en la base de datos y actualizará los saldos.

## Scripts de desarrollo (Frontend)

Si trabajas en local sin Docker:

```bash
cd frontend
npm install
npm start
```

- Correrá en `http://localhost:3000` con recarga automática.

### Build para producción

```bash
npm run build
```

Se generará la carpeta `build/` lista para servir con Nginx (usado en Docker).

## Notas

- Al usar “Cargar por defecto”, los gastos se insertan en bloque y luego pueden guardarse con un solo submit.
- Todos los movimientos se actualizan dinámicamente en los saldos por cuenta.
- Asegúrate de que las cuentas tengan `id` y `tipoCuenta` completos para evitar errores de backend.
- Se recomienda usar `Docker Compose` para levantar toda la app y la base de datos de forma consistente.

## Contacto / soporte

- Desarrollador: Sergio Ruiz Aragón
- Email: <sergio.ruiz.aragon9@gmail.com>  
- Proyecto mantenido bajo desarrollo personal.

