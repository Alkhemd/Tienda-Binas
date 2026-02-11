-- ═══════════════════════════════════════════════════════════
-- SCRIPT 004: GENERAR 10,000 CATEGORÍAS
-- Sistema de Tienda de Abarrotes "La Tiendita de Don Pepe"
-- ═══════════════════════════════════════════════════════════
-- IMPORTANTE: Ejecutar DESPUÉS de 003_seed_initial_data.sql
-- ═══════════════════════════════════════════════════════════

-- Generar 9,980 categorías adicionales (ya tenemos 20 del script 003)
INSERT INTO categorias (nombre)
SELECT 'Categoría ' || generate_series(21, 10000);

-- Verificación
SELECT COUNT(*) as total_categorias FROM categorias;
-- Resultado esperado: 10000
