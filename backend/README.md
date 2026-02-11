# Backend - Tienda de Abarrotes

## 🚀 Instalación

```bash
cd backend
npm install
```

## ⚙️ Configuración

1. Copiar `.env.example` a `.env`:
```bash
copy .env.example .env
```

2. Editar `.env` con tus credenciales de Supabase:
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
```

## 📊 Base de Datos

### Crear tablas en Supabase:
1. Ir a SQL Editor en Supabase
2. Ejecutar `../database/migrations/001_create_tables.sql`
3. Ejecutar `../database/migrations/003_seed_initial_data.sql`

### Generar 10,000 registros:
```bash
npm run seed
```

### Crear índices (DESPUÉS de generar datos):
1. Ejecutar consultas SIN índices (para evidencias)
2. Ejecutar `../database/migrations/002_create_indexes.sql`
3. Ejecutar consultas CON índices (para evidencias)

## 🏃 Ejecutar

### Modo desarrollo:
```bash
npm run dev
```

### Modo producción:
```bash
npm run build
npm start
```

## 📁 Estructura

```
src/
├── domain/              # Entidades y lógica de negocio
├── application/         # Casos de uso
├── infrastructure/      # Supabase, repositorios, seeders
└── presentation/        # API REST (controllers, routes)
```

## 🔗 Endpoints

- `GET /api/productos` - Listar productos
- `GET /api/productos/barcode/:codigo` - Buscar por código de barras
- `GET /api/ventas` - Listar ventas
- `POST /api/ventas` - Registrar venta
- `GET /api/clientes` - Listar clientes
- `GET /api/reportes/ventas-dia` - Reporte de ventas del día
