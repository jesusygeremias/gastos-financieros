-- Crear la base de datos solo si no existe
DO
$$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'misgastos') THEN
        CREATE DATABASE misgastos;
    END IF;
END
$$;

-- Asegurar contraseña del usuario
ALTER USER postgres WITH PASSWORD 'mi_password';

-- Conectarse a la base de datos
\connect misgastos

-- Tabla de cuentas bancarias
CREATE TABLE IF NOT EXISTS cuenta_bancaria (
    id SERIAL PRIMARY KEY,
    banco VARCHAR(50) NOT NULL,
    saldo NUMERIC(10,2) NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    tipo_cuenta VARCHAR(50) NOT NULL
);

-- Tabla de gastos mensuales dinámica
CREATE TABLE IF NOT EXISTS gasto_mensual (
    id SERIAL PRIMARY KEY,
    mes VARCHAR(20) NOT NULL,
    anio INT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    monto NUMERIC(10,2) NOT NULL,
    cuenta_id INT REFERENCES cuenta_bancaria(id),
    CONSTRAINT gasto_unico_mes_descripcion UNIQUE (mes, anio, descripcion)
);

-- Tabla de ingresos mensuales
CREATE TABLE IF NOT EXISTS ingreso_mensual (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(255),
    monto NUMERIC(12,2) NOT NULL,
    mes VARCHAR(20),
    anio INT,
    cuenta_id INT REFERENCES cuenta_bancaria(id)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE
);

-- Opcional: insertar algunas cuentas iniciales
INSERT INTO cuenta_bancaria (banco, tipo_cuenta, saldo, activo)
VALUES
('Openbank', 'AHORRO', 0, TRUE),
('Openbank', 'CORRIENTE', 0, TRUE),
('Openbank', 'HIPOTECA', 0, TRUE),
('Revolut', 'AHORRO', 0, TRUE),
('Revolut', 'CORRIENTE', 0, TRUE),
('ActivoBank', 'CORRIENTE', 0, TRUE),
('Pluxee', 'RESTAURANTE', 0, TRUE),
('Julia', 'CORRIENTE', 0, TRUE)
ON CONFLICT DO NOTHING; -- evita duplicados si se reinicia el contenedor

-- Insertar usuario admin (contraseña admin123 en BCrypt)
INSERT INTO users (username, password, enabled)
VALUES (
    'sergio.ruiz',
    '$2y$10$anAlI9y4KDtBLQFLl9W6wO4ql.PhlVwZ9XVIoY8FiXPQfI9S8j.6W',
    true
);

