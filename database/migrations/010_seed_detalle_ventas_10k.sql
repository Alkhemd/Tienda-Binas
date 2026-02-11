-- ═══════════════════════════════════════════════════════════
-- SCRIPT 010: GENERAR 10,000 DETALLES DE VENTA
-- Sistema de Tienda de Abarrotes "La Tiendita de Don Pepe"
-- ═══════════════════════════════════════════════════════════

INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal)
SELECT 
    1 + (num % 10000),
    1 + (num % 10000),
    1 + (num % 10),
    5 + (num % 95),
    (1 + (num % 10)) * (5 + (num % 95))
FROM generate_series(1, 10000) AS num;

-- Verificación
SELECT COUNT(*) as total_detalles FROM detalle_ventas;
-- Resultado esperado: 10000
