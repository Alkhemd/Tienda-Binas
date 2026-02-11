-- ═══════════════════════════════════════════════════════════
-- SCRIPT 009: GENERAR 10,000 VENTAS
-- Sistema de Tienda de Abarrotes "La Tiendita de Don Pepe"
-- ═══════════════════════════════════════════════════════════

INSERT INTO ventas (id_cliente, id_empleado, fecha_venta, total, tipo_pago)
SELECT 
    CASE WHEN num % 5 = 0 THEN NULL ELSE 1 + (num % 10000) END,
    1 + (num % 10000),
    CURRENT_DATE - (num % 365),
    10 + (num % 990),
    CASE (num % 3)
        WHEN 0 THEN 'efectivo'
        WHEN 1 THEN 'tarjeta'
        ELSE 'fiado'
    END
FROM generate_series(1, 10000) AS num;

-- Verificación
SELECT COUNT(*) as total_ventas FROM ventas;
-- Resultado esperado: 10000
