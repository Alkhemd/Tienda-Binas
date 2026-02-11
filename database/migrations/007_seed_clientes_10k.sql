-- ═══════════════════════════════════════════════════════════
-- SCRIPT 007: GENERAR 10,000 CLIENTES
-- Sistema de Tienda de Abarrotes "La Tiendita de Don Pepe"
-- ═══════════════════════════════════════════════════════════

INSERT INTO clientes (nombre, telefono, limite_credito, saldo_pendiente)
SELECT 
    'Cliente ' || num,
    '999-' || LPAD((num % 1000)::text, 3, '0') || '-' || LPAD((num % 10000)::text, 4, '0'),
    500 + (num % 4500),
    (num % 2000)
FROM generate_series(1, 10000) AS num;

-- Verificación
SELECT COUNT(*) as total_clientes FROM clientes;
-- Resultado esperado: 10000
