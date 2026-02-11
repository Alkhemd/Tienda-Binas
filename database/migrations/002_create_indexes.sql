-- ═══════════════════════════════════════════════════════════
-- SCRIPT 002: CREAR ÍNDICES
-- Sistema de Tienda de Abarrotes "La Tiendita de Don Pepe"
-- ═══════════════════════════════════════════════════════════
-- IMPORTANTE: Ejecutar DESPUÉS de generar los 10,000 registros
-- IMPORTANTE: Primero ejecutar consultas SIN índices para comparar
-- ═══════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- ÍNDICES NO AGRUPADOS (Non-Clustered)
-- ═══════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────
-- PRODUCTOS (4 índices)
-- ───────────────────────────────────────────────────────────
-- Búsqueda rápida por código de barras (punto de venta)
CREATE INDEX idx_productos_codigo_barras 
ON productos(codigo_barras);

-- Filtrar por categoría
CREATE INDEX idx_productos_categoria 
ON productos(id_categoria);

-- Alertas de productos próximos a caducar
CREATE INDEX idx_productos_caducidad 
ON productos(fecha_caducidad);

-- Filtrar por proveedor
CREATE INDEX idx_productos_proveedor 
ON productos(id_proveedor);

-- ───────────────────────────────────────────────────────────
-- VENTAS (3 índices)
-- ───────────────────────────────────────────────────────────
-- Reportes por rango de fechas
CREATE INDEX idx_ventas_fecha 
ON ventas(fecha_venta);

-- Historial de compras por cliente
CREATE INDEX idx_ventas_cliente 
ON ventas(id_cliente);

-- Ventas por empleado
CREATE INDEX idx_ventas_empleado 
ON ventas(id_empleado);

-- ───────────────────────────────────────────────────────────
-- DETALLE_VENTAS (2 índices)
-- ───────────────────────────────────────────────────────────
-- Productos en una venta específica
CREATE INDEX idx_detalle_venta 
ON detalle_ventas(id_venta);

-- Ventas de un producto específico
CREATE INDEX idx_detalle_producto 
ON detalle_ventas(id_producto);

-- ───────────────────────────────────────────────────────────
-- CLIENTES (2 índices)
-- ───────────────────────────────────────────────────────────
-- Clientes con saldo pendiente (fiado)
CREATE INDEX idx_clientes_saldo 
ON clientes(saldo_pendiente);

-- Búsqueda por teléfono
CREATE INDEX idx_clientes_telefono 
ON clientes(telefono);

-- ═══════════════════════════════════════════════════════════
-- ÍNDICES ÚNICOS (Unique)
-- ═══════════════════════════════════════════════════════════

-- Evitar códigos de barras duplicados
CREATE UNIQUE INDEX idx_productos_codigo_unico 
ON productos(codigo_barras);

-- ═══════════════════════════════════════════════════════════
-- ÍNDICES COMPUESTOS (Composite)
-- ═══════════════════════════════════════════════════════════

-- Ventas por fecha Y tipo de pago
CREATE INDEX idx_ventas_fecha_tipo 
ON ventas(fecha_venta, tipo_pago);

-- Ventas por fecha Y estado (para futuras expansiones)
CREATE INDEX idx_ventas_fecha_cliente 
ON ventas(fecha_venta, id_cliente);

-- Productos por categoría Y stock
CREATE INDEX idx_productos_cat_stock 
ON productos(id_categoria, stock_actual);

-- Detalle de venta por venta Y producto
CREATE INDEX idx_detalle_venta_prod 
ON detalle_ventas(id_venta, id_producto);

-- Productos por proveedor Y caducidad
CREATE INDEX idx_productos_prov_cad 
ON productos(id_proveedor, fecha_caducidad);

-- ═══════════════════════════════════════════════════════════
-- VERIFICACIÓN DE ÍNDICES CREADOS
-- ═══════════════════════════════════════════════════════════
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('productos', 'ventas', 'detalle_ventas', 'clientes')
ORDER BY tablename, indexname;

-- ═══════════════════════════════════════════════════════════
-- RESUMEN DE ÍNDICES
-- ═══════════════════════════════════════════════════════════
-- Agrupados (Clustered - PKs):        7 (automáticos)
-- No Agrupados (Non-Clustered):      11
-- Únicos (Unique):                    1
-- Compuestos (Composite):             5
-- ───────────────────────────────────────────────────────────
-- TOTAL:                             24 índices
-- ═══════════════════════════════════════════════════════════
