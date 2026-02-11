# 📊 Guía de Ejecución - Evidencias de Índices

## 🎯 Objetivo
Demostrar la mejora de rendimiento al usar índices en las consultas SQL.

---

## 📋 Pasos para Generar Evidencias

### **Paso 1: Ejecutar Scripts en Supabase** ✅

Ya deberías tener ejecutados:
- ✅ `001_create_tables.sql` (7 tablas)
- ✅ `003_seed_initial_data.sql` (datos básicos)

---

### **Paso 2: Generar 10,000 Registros**

En la terminal, dentro de la carpeta `backend/`:

```bash
npm run seed
```

**Esto generará:**
- 10,000 clientes
- 10,000 productos
- 10,000 ventas
- ~30,000 detalles de venta

**Tiempo estimado:** 2-3 minutos

---

### **Paso 3: Consultas SIN Índices** 📸

1. Ir a **SQL Editor** en Supabase
2. Abrir `database/queries/00_consultas_sin_indices.sql`
3. **Ejecutar cada consulta UNA POR UNA**
4. **Capturar pantalla** de cada resultado

#### **Consulta 1: Búsqueda por código de barras**
```sql
EXPLAIN ANALYZE
SELECT p.*, c.nombre as categoria
FROM productos p
JOIN categorias c ON p.id_categoria = c.id_categoria
WHERE p.codigo_barras = '7501234567890';
```

**Capturar:**
- Tiempo de ejecución
- Plan de ejecución (Seq Scan)
- Guardar como: `evidencias/01_sin_indices_barras.png`

#### **Consulta 2: Ventas por rango de fechas**
```sql
EXPLAIN ANALYZE
SELECT v.*, c.nombre as cliente
FROM ventas v
LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
WHERE v.fecha_venta >= '2025-01-01' 
  AND v.fecha_venta < '2025-02-01';
```

**Capturar:**
- Guardar como: `evidencias/02_sin_indices_fechas.png`

#### **Consulta 3: Productos más vendidos**
```sql
EXPLAIN ANALYZE
SELECT p.nombre, SUM(dv.cantidad) as total
FROM detalle_ventas dv
JOIN productos p ON dv.id_producto = p.id_producto
GROUP BY p.id_producto, p.nombre
ORDER BY total DESC
LIMIT 20;
```

**Capturar:**
- Guardar como: `evidencias/03_sin_indices_mas_vendidos.png`

#### **Consulta 4: Clientes con saldo pendiente**
```sql
EXPLAIN ANALYZE
SELECT nombre, saldo_pendiente
FROM clientes
WHERE saldo_pendiente > 0
ORDER BY saldo_pendiente DESC;
```

**Capturar:**
- Guardar como: `evidencias/04_sin_indices_saldo.png`

#### **Consulta 5: Productos próximos a caducar**
```sql
EXPLAIN ANALYZE
SELECT p.nombre, p.fecha_caducidad
FROM productos p
WHERE p.fecha_caducidad <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY p.fecha_caducidad ASC;
```

**Capturar:**
- Guardar como: `evidencias/05_sin_indices_caducidad.png`

#### **Consulta 6: Ventas por tipo de pago**
```sql
EXPLAIN ANALYZE
SELECT DATE(fecha_venta), tipo_pago, COUNT(*)
FROM ventas
WHERE fecha_venta >= '2025-01-01'
GROUP BY DATE(fecha_venta), tipo_pago;
```

**Capturar:**
- Guardar como: `evidencias/06_sin_indices_tipo_pago.png`

---

### **Paso 4: Crear Índices** 🔧

En SQL Editor de Supabase:

1. Abrir `database/migrations/002_create_indexes.sql`
2. **Ejecutar TODO el script**
3. Verificar que se crearon 24 índices

---

### **Paso 5: Consultas CON Índices** 📸

1. **Volver a ejecutar las mismas 6 consultas**
2. **Capturar pantallas nuevamente**
3. Guardar como:
   - `evidencias/01_con_indices_barras.png`
   - `evidencias/02_con_indices_fechas.png`
   - `evidencias/03_con_indices_mas_vendidos.png`
   - `evidencias/04_con_indices_saldo.png`
   - `evidencias/05_con_indices_caducidad.png`
   - `evidencias/06_con_indices_tipo_pago.png`

---

### **Paso 6: Comparar Resultados** 📊

Crear tabla comparativa:

| Consulta | Sin Índices | Con Índices | Mejora |
|----------|-------------|-------------|--------|
| 1. Código de barras | 250ms | 2ms | **125x** |
| 2. Ventas por fecha | 180ms | 5ms | **36x** |
| 3. Más vendidos | 320ms | 8ms | **40x** |
| 4. Saldo pendiente | 150ms | 3ms | **50x** |
| 5. Próximos a caducar | 200ms | 4ms | **50x** |
| 6. Tipo de pago | 280ms | 6ms | **47x** |

**Nota:** Los tiempos son aproximados, dependen de tu conexión y servidor.

---

## 📁 Estructura de Evidencias

```
docs/evidencias/
├── 01_sin_indices_barras.png
├── 01_con_indices_barras.png
├── 02_sin_indices_fechas.png
├── 02_con_indices_fechas.png
├── 03_sin_indices_mas_vendidos.png
├── 03_con_indices_mas_vendidos.png
├── 04_sin_indices_saldo.png
├── 04_con_indices_saldo.png
├── 05_sin_indices_caducidad.png
├── 05_con_indices_caducidad.png
├── 06_sin_indices_tipo_pago.png
└── 06_con_indices_tipo_pago.png
```

---

## ✅ Checklist

- [ ] Generar 10,000 registros (`npm run seed`)
- [ ] Ejecutar 6 consultas SIN índices
- [ ] Capturar 6 pantallas SIN índices
- [ ] Ejecutar `002_create_indexes.sql`
- [ ] Ejecutar 6 consultas CON índices
- [ ] Capturar 6 pantallas CON índices
- [ ] Crear tabla comparativa
- [ ] Documentar en PDF

---

## 🎓 Para el PDF

Incluir en el documento:
1. **Introducción:** Caso de uso de la tienda
2. **Diagrama ER:** Con cardinalidades
3. **Tablas creadas:** 7 tablas con descripción
4. **Índices implementados:** 24 índices con justificación
5. **Evidencias:** 12 capturas (6 sin índices + 6 con índices)
6. **Tabla comparativa:** Tiempos de ejecución
7. **Conclusiones:** Mejora de rendimiento
8. **Respuestas teóricas:** 6 preguntas

---

**¡Listo para generar evidencias!** 🚀
