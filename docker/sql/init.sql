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

-- Crear tabla dentro de misgastos
-- Esta parte se ejecuta automáticamente solo si el contenedor se inicializa por primera vez
-- Para ejecutar en init.sql, hay que conectarse a la base de datos específica:
\connect misgastos

CREATE TABLE IF NOT EXISTS gasto_mensual (
                                             id SERIAL PRIMARY KEY,
                                             mes VARCHAR(20),
                                             salario NUMERIC(10,2),
                                             comunidad NUMERIC(10,2),
                                             garaje NUMERIC(10,2),
                                             internet NUMERIC(10,2),
                                             electricidad NUMERIC(10,2),
                                             agua NUMERIC(10,2),
                                             pac NUMERIC(10,2),
                                             seguro NUMERIC(10,2),
                                             revolut_ahorro NUMERIC(10,2),
                                             revolut_corriente NUMERIC(10,2)
);
