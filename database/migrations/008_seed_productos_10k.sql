-- ═══════════════════════════════════════════════════════════
-- SCRIPT 008: GENERAR 10,000 PRODUCTOS
-- Sistema de Tienda de Abarrotes "La Tiendita de Don Pepe"
-- ═══════════════════════════════════════════════════════════

INSERT INTO productos (codigo_barras, nombre, id_categoria, id_proveedor, precio_venta, stock_actual, fecha_caducidad)
SELECT 
    LPAD((num)::text, 13, '0'),
    'Producto ' || num,
    1 + (num % 10000),
    1 + (num % 10000),
    5 + (num % 495),
    num % 200,
    CASE 
        WHEN num % 10 < 7 THEN CURRENT_DATE + (num % 730)
        ELSE NULL
    END
FROM generate_series(1, 10000) AS num;

-- Verificación
SELECT COUNT(*) as total_productos FROM productos;
-- Resultado esperado: 10000
