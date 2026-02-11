-- ═══════════════════════════════════════════════════════════
-- SCRIPT 006: GENERAR 10,000 EMPLEADOS
-- Sistema de Tienda de Abarrotes "La Tiendita de Don Pepe"
-- ═══════════════════════════════════════════════════════════
-- IMPORTANTE: Ejecutar DESPUÉS de 003_seed_initial_data.sql
-- ═══════════════════════════════════════════════════════════

-- Generar 9,990 empleados adicionales (ya tenemos 10 del script 003)
INSERT INTO empleados (nombre, puesto, salario)
SELECT 
    'Empleado ' || num,
    CASE (num % 4)
        WHEN 0 THEN 'Cajero'
        WHEN 1 THEN 'Almacenista'
        WHEN 2 THEN 'Repartidor'
        ELSE 'Limpieza'
    END,
    5500 + (num % 3000)
FROM generate_series(11, 10000) AS num;

-- Verificación
SELECT COUNT(*) as total_empleados FROM empleados;
-- Resultado esperado: 10000
