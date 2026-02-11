-- ═══════════════════════════════════════════════════════════
-- CONSULTAS SIN ÍNDICES
-- Sistema de Tienda de Abarrotes "La Tiendita de Don Pepe"
-- ═══════════════════════════════════════════════════════════
-- IMPORTANTE: Ejecutar ANTES de crear índices (002_create_indexes.sql)
-- IMPORTANTE: Capturar el plan de ejecución de cada consulta
-- ═══════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- CONSULTA 1: Búsqueda por código de barras
-- Caso de uso: Punto de venta escaneando producto
-- ═══════════════════════════════════════════════════════════
EXPLAIN ANALYZE
SELECT 
    p.id_producto,
    p.codigo_barras,
    p.nombre,
    p.precio_venta,
    p.stock_actual,
    c.nombre as categoria,
    pr.nombre_empresa as proveedor
FROM productos p
JOIN categorias c ON p.id_categoria = c.id_categoria
JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
WHERE p.codigo_barras = '7501234567890';

-- ═══════════════════════════════════════════════════════════
-- CONSULTA 2: Ventas por rango de fechas
-- Caso de uso: Reporte de ventas del mes
-- ═══════════════════════════════════════════════════════════
EXPLAIN ANALYZE
SELECT 
    v.id_venta,
    v.fecha_venta,
    v.total,
    v.tipo_pago,
    c.nombre as cliente,
    e.nombre as empleado
FROM ventas v
LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
JOIN empleados e ON v.id_empleado = e.id_empleado
WHERE v.fecha_venta >= '2025-01-01' 
  AND v.fecha_venta < '2025-02-01'
ORDER BY v.fecha_venta DESC;

-- ═══════════════════════════════════════════════════════════
-- CONSULTA 3: Productos más vendidos
-- Caso de uso: Análisis de inventario
-- ═══════════════════════════════════════════════════════════
EXPLAIN ANALYZE
SELECT 
    p.nombre,
    p.codigo_barras,
    SUM(dv.cantidad) as total_vendido,
    SUM(dv.subtotal) as ingresos_totales
FROM detalle_ventas dv
JOIN productos p ON dv.id_producto = p.id_producto
GROUP BY p.id_producto, p.nombre, p.codigo_barras
ORDER BY total_vendido DESC
LIMIT 20;

-- ═══════════════════════════════════════════════════════════
-- CONSULTA 4: Clientes con saldo pendiente
-- Caso de uso: Gestión de crédito/fiado
-- ═══════════════════════════════════════════════════════════
EXPLAIN ANALYZE
SELECT 
    c.nombre,
    c.telefono,
    c.saldo_pendiente,
    c.limite_credito,
    (c.limite_credito - c.saldo_pendiente) as credito_disponible
FROM clientes c
WHERE c.saldo_pendiente > 0
ORDER BY c.saldo_pendiente DESC
LIMIT 50;

-- ═══════════════════════════════════════════════════════════
-- CONSULTA 5: Productos próximos a caducar
-- Caso de uso: Alertas de vencimiento
-- ═══════════════════════════════════════════════════════════
EXPLAIN ANALYZE
SELECT 
    p.nombre,
    p.codigo_barras,
    p.fecha_caducidad,
    p.stock_actual,
    c.nombre as categoria,
    (p.fecha_caducidad - CURRENT_DATE) as dias_restantes
FROM productos p
JOIN categorias c ON p.id_categoria = c.id_categoria
WHERE p.fecha_caducidad IS NOT NULL
  AND p.fecha_caducidad <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY p.fecha_caducidad ASC
LIMIT 50;

-- ═══════════════════════════════════════════════════════════
-- CONSULTA 6: Ventas por tipo de pago y fecha
-- Caso de uso: Análisis de métodos de pago
-- ═══════════════════════════════════════════════════════════
EXPLAIN ANALYZE
SELECT 
    DATE(v.fecha_venta) as fecha,
    v.tipo_pago,
    COUNT(*) as num_ventas,
    SUM(v.total) as total_vendido
FROM ventas v
WHERE v.fecha_venta >= '2025-01-01'
  AND v.fecha_venta < '2026-01-01'
GROUP BY DATE(v.fecha_venta), v.tipo_pago
ORDER BY fecha DESC, tipo_pago;

-- ═══════════════════════════════════════════════════════════
-- INSTRUCCIONES PARA CAPTURAR EVIDENCIAS
-- ═══════════════════════════════════════════════════════════
-- 1. Ejecutar cada consulta en Supabase SQL Editor
-- 2. Capturar pantalla del plan de ejecución (EXPLAIN ANALYZE)
-- 3. Anotar el tiempo de ejecución
-- 4. Guardar capturas como: consulta_1_sin_indices.png, etc.
-- 5. Después ejecutar 002_create_indexes.sql
-- 6. Volver a ejecutar estas consultas
-- 7. Capturar nuevas evidencias: consulta_1_con_indices.png, etc.
-- 8. Comparar tiempos de ejecución
-- ═══════════════════════════════════════════════════════════
