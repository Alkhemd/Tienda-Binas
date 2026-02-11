// ═══════════════════════════════════════════════════════════
// SERVIDOR EXPRESS
// ═══════════════════════════════════════════════════════════

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════════════════════════
// MIDDLEWARES
// ═══════════════════════════════════════════════════════════
app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════════════════════
// RUTAS
// ═══════════════════════════════════════════════════════════
app.get('/', (req, res) => {
    res.json({
        message: '🛒 API Tienda de Abarrotes "La Tiendita de Don Pepe"',
        version: '1.0.0',
        endpoints: {
            productos: '/api/productos',
            ventas: '/api/ventas',
            clientes: '/api/clientes'
        }
    });
});

// Importar rutas (se crearán después)
// import productosRoutes from './presentation/api/routes/productos.routes';
// import ventasRoutes from './presentation/api/routes/ventas.routes';
// app.use('/api/productos', productosRoutes);
// app.use('/api/ventas', ventasRoutes);

// ═══════════════════════════════════════════════════════════
// INICIAR SERVIDOR
// ═══════════════════════════════════════════════════════════
app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Base de datos: Supabase`);
    console.log(`${'='.repeat(60)}\n`);
});

export default app;
