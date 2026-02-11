-- ═══════════════════════════════════════════════════════════
-- SCRIPT 005: GENERAR 10,000 PROVEEDORES
-- Sistema de Tienda de Abarrotes "La Tiendita de Don Pepe"
-- ═══════════════════════════════════════════════════════════
-- IMPORTANTE: Ejecutar DESPUÉS de 003_seed_initial_data.sql
-- ═══════════════════════════════════════════════════════════

-- Generar 9,950 proveedores adicionales (ya tenemos 50 del script 003)
INSERT INTO proveedores (nombre_empresa, telefono)
SELECT 
    'Proveedor ' || generate_series(51, 10000),
    '999-' || LPAD((generate_series(51, 10000) % 1000)::text, 3, '0') || '-' || LPAD((generate_series(51, 10000) % 10000)::text, 4, '0');

-- Verificación
SELECT COUNT(*) as total_proveedores FROM proveedores;
-- Resultado esperado: 10000
