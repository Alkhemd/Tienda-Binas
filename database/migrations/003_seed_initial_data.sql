-- ═══════════════════════════════════════════════════════════
-- SCRIPT 003: DATOS INICIALES (SEED)
-- Sistema de Tienda de Abarrotes "La Tiendita de Don Pepe"
-- ═══════════════════════════════════════════════════════════
-- IMPORTANTE: Ejecutar DESPUÉS de crear tablas
-- IMPORTANTE: Los 10,000 registros se generan con seeders TypeScript
-- ═══════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- CATEGORIAS (20 registros)
-- ═══════════════════════════════════════════════════════════
INSERT INTO categorias (nombre) VALUES
('Abarrotes'),
('Bebidas'),
('Lácteos'),
('Panadería'),
('Dulces y Chocolates'),
('Botanas'),
('Enlatados'),
('Higiene Personal'),
('Limpieza'),
('Carnes Frías'),
('Frutas y Verduras'),
('Congelados'),
('Cereales'),
('Condimentos'),
('Aceites y Vinagres'),
('Pastas'),
('Harinas'),
('Galletas'),
('Refrescos'),
('Jugos');

-- ═══════════════════════════════════════════════════════════
-- PROVEEDORES (50 registros)
-- ═══════════════════════════════════════════════════════════
INSERT INTO proveedores (nombre_empresa, telefono) VALUES
('Coca-Cola FEMSA', '999-123-4567'),
('Grupo Bimbo', '999-234-5678'),
('Sabritas', '999-345-6789'),
('Lala', '999-456-7890'),
('Nestlé México', '999-567-8901'),
('Pepsi-Cola', '999-678-9012'),
('Barcel', '999-789-0123'),
('Gamesa', '999-890-1234'),
('Herdez', '999-901-2345'),
('La Costeña', '999-012-3456'),
('Jumex', '999-123-4568'),
('Alpura', '999-234-5679'),
('Marinela', '999-345-6780'),
('Ricolino', '999-456-7891'),
('Kellogg''s', '999-567-8902'),
('Quaker', '999-678-9013'),
('Maseca', '999-789-0124'),
('Minsa', '999-890-1235'),
('Del Fuerte', '999-901-2346'),
('Clemente Jacques', '999-012-3457'),
('McCormick', '999-123-4569'),
('Capullo', '999-234-5670'),
('Nutrioli', '999-345-6781'),
('Tres Estrellas', '999-456-7892'),
('La Moderna', '999-567-8903'),
('Aurrera', '999-678-9014'),
('Colgate-Palmolive', '999-789-0125'),
('Procter & Gamble', '999-890-1236'),
('Unilever', '999-901-2347'),
('SC Johnson', '999-012-3458'),
('Fud', '999-123-4560'),
('San Rafael', '999-234-5671'),
('Zwan', '999-345-6782'),
('Sigma Alimentos', '999-456-7893'),
('Yakult', '999-567-8904'),
('Danone', '999-678-9015'),
('Yoplait', '999-789-0126'),
('Bonafont', '999-890-1237'),
('Ciel', '999-901-2348'),
('Epura', '999-012-3459'),
('Santa Clara', '999-123-4561'),
('Holanda', '999-234-5672'),
('Coronado', '999-345-6783'),
('Bachoco', '999-456-7894'),
('Pilgrim''s', '999-567-8905'),
('Sukarne', '999-678-9016'),
('Soriana', '999-789-0127'),
('Chedraui', '999-890-1238'),
('Walmart México', '999-901-2349'),
('Comercial Mexicana', '999-012-3450');

-- ═══════════════════════════════════════════════════════════
-- EMPLEADOS (10 registros)
-- ═══════════════════════════════════════════════════════════
INSERT INTO empleados (nombre, puesto, salario) VALUES
('María López García', 'Encargada', 8500.00),
('Juan Pérez Martínez', 'Cajero', 6000.00),
('Ana García Rodríguez', 'Cajera', 6000.00),
('Carlos Martínez Sánchez', 'Almacenista', 6500.00),
('Laura Hernández López', 'Cajera', 6000.00),
('Pedro Sánchez González', 'Cajero', 6000.00),
('Rosa González Pérez', 'Limpieza', 5500.00),
('Miguel Rodríguez Hernández', 'Repartidor', 6200.00),
('Carmen López Martínez', 'Cajera', 6000.00),
('José García Sánchez', 'Cajero', 6000.00);

-- ═══════════════════════════════════════════════════════════
-- VERIFICACIÓN
-- ═══════════════════════════════════════════════════════════
SELECT 
    'categorias' as tabla, COUNT(*) as registros FROM categorias
UNION ALL
SELECT 'proveedores', COUNT(*) FROM proveedores
UNION ALL
SELECT 'empleados', COUNT(*) FROM empleados;

-- ═══════════════════════════════════════════════════════════
-- RESULTADO ESPERADO:
-- categorias: 20
-- proveedores: 50
-- empleados: 10
-- ═══════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- NOTA: Los 10,000 registros de clientes, productos y ventas
-- se generarán con seeders TypeScript usando Faker.js
-- Ejecutar: npm run seed
-- ═══════════════════════════════════════════════════════════
