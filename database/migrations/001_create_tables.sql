-- ═══════════════════════════════════════════════════════════
-- SCRIPT 001: CREAR TABLAS
-- Sistema de Tienda de Abarrotes "La Tiendita de Don Pepe"
-- ═══════════════════════════════════════════════════════════
-- IMPORTANTE: Ejecutar ANTES de crear índices
-- ═══════════════════════════════════════════════════════════

-- Eliminar tablas si existen (para re-ejecución)
DROP TABLE IF EXISTS detalle_ventas CASCADE;
DROP TABLE IF EXISTS ventas CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS empleados CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;

-- ═══════════════════════════════════════════════════════════
-- TABLA 1: CATEGORIAS
-- ═══════════════════════════════════════════════════════════
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

COMMENT ON TABLE categorias IS 'Clasificación de productos (Abarrotes, Bebidas, Lácteos, etc.)';

-- ═══════════════════════════════════════════════════════════
-- TABLA 2: PROVEEDORES
-- ═══════════════════════════════════════════════════════════
CREATE TABLE proveedores (
    id_proveedor SERIAL PRIMARY KEY,
    nombre_empresa VARCHAR(200) NOT NULL,
    telefono VARCHAR(20)
);

COMMENT ON TABLE proveedores IS 'Empresas que surten productos (Coca-Cola, Bimbo, etc.)';

-- ═══════════════════════════════════════════════════════════
-- TABLA 3: EMPLEADOS
-- ═══════════════════════════════════════════════════════════
CREATE TABLE empleados (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    puesto VARCHAR(50),
    salario DECIMAL(10,2)
);

COMMENT ON TABLE empleados IS 'Personal que trabaja en la tienda';

-- ═══════════════════════════════════════════════════════════
-- TABLA 4: CLIENTES
-- ═══════════════════════════════════════════════════════════
CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    limite_credito DECIMAL(10,2) DEFAULT 500.00,
    saldo_pendiente DECIMAL(10,2) DEFAULT 0.00,
    
    CONSTRAINT chk_limite_credito CHECK (limite_credito >= 0),
    CONSTRAINT chk_saldo_pendiente CHECK (saldo_pendiente >= 0)
);

COMMENT ON TABLE clientes IS 'Personas que compran en la tienda (pueden tener crédito/fiado)';

-- ═══════════════════════════════════════════════════════════
-- TABLA 5: PRODUCTOS
-- Cardinalidad: (1,1) con CATEGORIA y PROVEEDOR
-- ═══════════════════════════════════════════════════════════
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    codigo_barras VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    id_categoria INT NOT NULL REFERENCES categorias(id_categoria),
    id_proveedor INT NOT NULL REFERENCES proveedores(id_proveedor),
    precio_venta DECIMAL(10,2) NOT NULL,
    stock_actual INT DEFAULT 0,
    fecha_caducidad DATE,
    
    CONSTRAINT chk_precio_venta CHECK (precio_venta > 0),
    CONSTRAINT chk_stock_actual CHECK (stock_actual >= 0)
);

COMMENT ON TABLE productos IS 'Artículos que se venden en la tienda';

-- ═══════════════════════════════════════════════════════════
-- TABLA 6: VENTAS
-- Cardinalidad: (0,1) con CLIENTE, (1,1) con EMPLEADO
-- ═══════════════════════════════════════════════════════════
CREATE TABLE ventas (
    id_venta SERIAL PRIMARY KEY,
    id_cliente INT REFERENCES clientes(id_cliente),              -- Opcional (0,1)
    id_empleado INT NOT NULL REFERENCES empleados(id_empleado),  -- Obligatorio (1,1)
    fecha_venta TIMESTAMP DEFAULT NOW(),
    total DECIMAL(10,2) NOT NULL,
    tipo_pago VARCHAR(20) NOT NULL CHECK (tipo_pago IN ('efectivo','tarjeta','fiado')),
    
    CONSTRAINT chk_total CHECK (total > 0)
);

COMMENT ON TABLE ventas IS 'Transacciones de venta en el punto de venta';

-- ═══════════════════════════════════════════════════════════
-- TABLA 7: DETALLE_VENTAS
-- Relación M:N entre VENTA y PRODUCTO
-- Cardinalidad: (1,1) con VENTA y PRODUCTO
-- ═══════════════════════════════════════════════════════════
CREATE TABLE detalle_ventas (
    id_detalle SERIAL PRIMARY KEY,
    id_venta INT NOT NULL REFERENCES ventas(id_venta) ON DELETE CASCADE,
    id_producto INT NOT NULL REFERENCES productos(id_producto),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    
    CONSTRAINT chk_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_precio_unitario CHECK (precio_unitario > 0),
    CONSTRAINT chk_subtotal CHECK (subtotal > 0)
);

COMMENT ON TABLE detalle_ventas IS 'Productos incluidos en cada venta';

-- ═══════════════════════════════════════════════════════════
-- VERIFICACIÓN
-- ═══════════════════════════════════════════════════════════
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columnas
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ═══════════════════════════════════════════════════════════
-- RESULTADO ESPERADO: 7 tablas creadas
-- ═══════════════════════════════════════════════════════════
