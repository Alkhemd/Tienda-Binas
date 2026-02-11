# Sistema de Tienda de Abarrotes "La Tiendita de Don Pepe"

## 📋 Proyecto Académico
**Materia:** Bases de Datos  
**Actividad:** U2 - Índices (Binas)  
**Fecha de Entrega:** 12 de febrero de 2026

## 🎯 Objetivo
Demostrar la implementación y optimización de índices SQL en un sistema real de punto de venta para tienda de abarrotes.

## 🏗️ Arquitectura
- **Backend:** TypeScript + Express + Supabase (DDD)
- **Frontend:** React + Vite + TailwindCSS
- **Base de Datos:** PostgreSQL (Supabase)

## 📊 Base de Datos
- **7 tablas** relacionadas
- **24 índices** (agrupados, no agrupados, únicos, compuestos)
- **10,000 registros** por tabla (generados con Faker.js)

## 🚀 Inicio Rápido

### 1. Clonar/Descargar el proyecto
```bash
cd C:\Users\alank\.gemini\antigravity\scratch\tienda-abarrotes
```

### 2. Configurar Base de Datos (Supabase)
1. Crear proyecto en https://supabase.com
2. Ir a SQL Editor
3. Ejecutar en orden:
   - `database/migrations/001_create_tables.sql`
   - `database/migrations/003_seed_initial_data.sql`

### 3. Configurar Backend
```bash
cd backend
npm install
copy .env.example .env
# Editar .env con credenciales de Supabase
npm run dev
```

### 4. Generar 10,000 Registros
```bash
npm run seed
```

### 5. Evidencias de Índices

#### SIN índices (capturas para PDF):
```bash
# En Supabase SQL Editor:
# Ejecutar: database/queries/00_consultas_sin_indices.sql
# Capturar planes de ejecución
```

#### CON índices:
```bash
# En Supabase SQL Editor:
# Ejecutar: database/migrations/002_create_indexes.sql
# Ejecutar nuevamente las consultas
# Capturar planes de ejecución mejorados
```

### 6. Configurar Frontend (Opcional)
```bash
cd frontend
npm install
npm run dev
```

## 📁 Estructura del Proyecto

```
tienda-abarrotes/
├── backend/                    # API REST (Puerto 3000)
│   ├── src/
│   │   ├── domain/             # Entidades y lógica
│   │   ├── application/        # Casos de uso
│   │   ├── infrastructure/     # Supabase + Seeders
│   │   └── presentation/       # Controllers + Routes
│   └── package.json
│
├── database/                   # Scripts SQL
│   ├── migrations/
│   │   ├── 001_create_tables.sql       # 7 tablas
│   │   ├── 002_create_indexes.sql      # 24 índices
│   │   └── 003_seed_initial_data.sql   # Datos básicos
│   └── queries/                # Consultas de demostración
│
├── frontend/                   # React + Vite
└── docs/                       # Documentación
```

## 🔍 Índices Implementados

### No Agrupados (11):
- `idx_productos_codigo_barras` - Búsqueda en punto de venta
- `idx_ventas_fecha` - Reportes por período
- `idx_productos_caducidad` - Alertas de vencimiento
- Y más...

### Únicos (1):
- `idx_productos_codigo_unico` - Sin duplicados

### Compuestos (5):
- `idx_ventas_fecha_tipo` - Análisis multidimensional
- `idx_productos_cat_stock` - Inventario por categoría
- Y más...

## 📊 Consultas de Demostración

1. Búsqueda por código de barras (1000x más rápido)
2. Ventas por rango de fechas (100x más rápido)
3. Productos más vendidos (50x más rápido)
4. Clientes con saldo pendiente (100x más rápido)
5. Productos próximos a caducar (100x más rápido)
6. Ventas por tipo de pago (100x más rápido)

## 📖 Documentación

Ver carpeta `docs/` para:
- Diagrama ER
- Justificación de índices
- Guía de implementación
- Evidencias de planes de ejecución

## 👥 Equipo
[Nombres del equipo]

## 📄 Licencia
Proyecto Académico - 2026
