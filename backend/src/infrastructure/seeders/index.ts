// ═══════════════════════════════════════════════════════════
// SEEDER: Generar 10,000 Registros
// ═══════════════════════════════════════════════════════════

import { faker } from '@faker-js/faker/locale/es_MX';
import { supabase } from '../database/supabase';

// ═══════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════

function generarCodigoBarras(): string {
    return faker.string.numeric(13); // EAN-13
}

function generarTelefono(): string {
    return `999-${faker.string.numeric(3)}-${faker.string.numeric(4)}`;
}

function fechaAleatoria(diasAtras: number): Date {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - faker.number.int({ min: 0, max: diasAtras }));
    return fecha;
}

// ═══════════════════════════════════════════════════════════
// SEEDER: CLIENTES (10,000 registros)
// ═══════════════════════════════════════════════════════════
async function seedClientes() {
    console.log('\n📋 Generando 10,000 clientes...');

    const BATCH_SIZE = 1000;
    const TOTAL = 10000;

    for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
        const clientes = [];

        for (let j = 0; j < BATCH_SIZE; j++) {
            const limiteCredito = faker.number.int({ min: 500, max: 5000 });
            const saldoPendiente = faker.number.int({ min: 0, max: limiteCredito });

            clientes.push({
                nombre: faker.person.fullName(),
                telefono: generarTelefono(),
                limite_credito: limiteCredito,
                saldo_pendiente: saldoPendiente
            });
        }

        const { error } = await supabase.from('clientes').insert(clientes);

        if (error) {
            console.error(`❌ Error en batch ${i / BATCH_SIZE + 1}:`, error);
            throw error;
        }

        console.log(`✅ Insertados ${i + BATCH_SIZE} / ${TOTAL} clientes`);
    }

    console.log('✅ 10,000 clientes generados exitosamente\n');
}

// ═══════════════════════════════════════════════════════════
// SEEDER: PRODUCTOS (10,000 registros)
// ═══════════════════════════════════════════════════════════
async function seedProductos() {
    console.log('\n📦 Generando 10,000 productos...');

    const BATCH_SIZE = 1000;
    const TOTAL = 10000;

    // Obtener IDs de categorías y proveedores
    const { data: categorias } = await supabase.from('categorias').select('id_categoria');
    const { data: proveedores } = await supabase.from('proveedores').select('id_proveedor');

    if (!categorias || !proveedores) {
        throw new Error('❌ Faltan categorías o proveedores. Ejecutar 003_seed_initial_data.sql primero.');
    }

    for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
        const productos = [];

        for (let j = 0; j < BATCH_SIZE; j++) {
            const precioVenta = faker.number.float({ min: 5, max: 500, fractionDigits: 2 });
            const stockActual = faker.number.int({ min: 0, max: 200 });

            // 70% de productos con fecha de caducidad
            const tieneCaducidad = faker.datatype.boolean({ probability: 0.7 });
            const fechaCaducidad = tieneCaducidad
                ? faker.date.future({ years: 2 }).toISOString().split('T')[0]
                : null;

            productos.push({
                codigo_barras: generarCodigoBarras(),
                nombre: faker.commerce.productName(),
                id_categoria: faker.helpers.arrayElement(categorias).id_categoria,
                id_proveedor: faker.helpers.arrayElement(proveedores).id_proveedor,
                precio_venta: precioVenta,
                stock_actual: stockActual,
                fecha_caducidad: fechaCaducidad
            });
        }

        const { error } = await supabase.from('productos').insert(productos);

        if (error) {
            console.error(`❌ Error en batch ${i / BATCH_SIZE + 1}:`, error);
            throw error;
        }

        console.log(`✅ Insertados ${i + BATCH_SIZE} / ${TOTAL} productos`);
    }

    console.log('✅ 10,000 productos generados exitosamente\n');
}

// ═══════════════════════════════════════════════════════════
// SEEDER: VENTAS (10,000 registros)
// ═══════════════════════════════════════════════════════════
async function seedVentas() {
    console.log('\n💰 Generando 10,000 ventas...');

    const BATCH_SIZE = 500;
    const TOTAL = 10000;

    // Obtener IDs
    const { data: clientes } = await supabase.from('clientes').select('id_cliente').limit(1000);
    const { data: empleados } = await supabase.from('empleados').select('id_empleado');
    const { data: productos } = await supabase.from('productos').select('id_producto, precio_venta').limit(1000);

    if (!clientes || !empleados || !productos) {
        throw new Error('❌ Faltan datos base. Ejecutar seeders anteriores primero.');
    }

    for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
        const ventas = [];
        const detalles = [];

        for (let j = 0; j < BATCH_SIZE; j++) {
            // 80% de ventas con cliente, 20% sin cliente
            const tieneCliente = faker.datatype.boolean({ probability: 0.8 });
            const idCliente = tieneCliente ? faker.helpers.arrayElement(clientes).id_cliente : null;

            const fechaVenta = fechaAleatoria(365); // Último año
            const tipoPago = faker.helpers.arrayElement(['efectivo', 'tarjeta', 'fiado']);

            // Generar productos para esta venta (1-5 productos)
            const numProductos = faker.number.int({ min: 1, max: 5 });
            let totalVenta = 0;

            for (let k = 0; k < numProductos; k++) {
                const producto = faker.helpers.arrayElement(productos);
                const cantidad = faker.number.int({ min: 1, max: 10 });
                const precioUnitario = producto.precio_venta;
                const subtotal = cantidad * precioUnitario;

                totalVenta += subtotal;

                detalles.push({
                    id_venta: i + j + 1, // Se asignará después
                    id_producto: producto.id_producto,
                    cantidad,
                    precio_unitario: precioUnitario,
                    subtotal
                });
            }

            ventas.push({
                id_cliente: idCliente,
                id_empleado: faker.helpers.arrayElement(empleados).id_empleado,
                fecha_venta: fechaVenta.toISOString(),
                total: totalVenta,
                tipo_pago: tipoPago
            });
        }

        // Insertar ventas
        const { data: ventasInsertadas, error: errorVentas } = await supabase
            .from('ventas')
            .insert(ventas)
            .select('id_venta');

        if (errorVentas) {
            console.error(`❌ Error insertando ventas:`, errorVentas);
            throw errorVentas;
        }

        // Actualizar IDs de detalles
        const detallesConId = detalles.map((detalle, index) => ({
            ...detalle,
            id_venta: ventasInsertadas![Math.floor(index / 3)]?.id_venta || ventasInsertadas![0].id_venta
        }));

        // Insertar detalles
        const { error: errorDetalles } = await supabase
            .from('detalle_ventas')
            .insert(detallesConId);

        if (errorDetalles) {
            console.error(`❌ Error insertando detalles:`, errorDetalles);
            throw errorDetalles;
        }

        console.log(`✅ Insertadas ${i + BATCH_SIZE} / ${TOTAL} ventas`);
    }

    console.log('✅ 10,000 ventas generadas exitosamente\n');
}

// ═══════════════════════════════════════════════════════════
// EJECUTAR TODOS LOS SEEDERS
// ═══════════════════════════════════════════════════════════
async function main() {
    console.log('\n' + '='.repeat(60));
    console.log('🌱 INICIANDO GENERACIÓN DE DATOS');
    console.log('='.repeat(60));

    const inicio = Date.now();

    try {
        await seedClientes();
        await seedProductos();
        await seedVentas();

        const duracion = ((Date.now() - inicio) / 1000).toFixed(2);

        console.log('='.repeat(60));
        console.log('✅ TODOS LOS DATOS GENERADOS EXITOSAMENTE');
        console.log(`⏱️  Tiempo total: ${duracion} segundos`);
        console.log('='.repeat(60));
        console.log('\n📊 Resumen:');
        console.log('   - 10,000 clientes');
        console.log('   - 10,000 productos');
        console.log('   - 10,000 ventas');
        console.log('   - ~30,000 detalles de venta');
        console.log('\n🎯 Siguiente paso: Ejecutar consultas SIN índices para evidencias');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('\n❌ ERROR:', error);
        process.exit(1);
    }
}

// Ejecutar
main();
