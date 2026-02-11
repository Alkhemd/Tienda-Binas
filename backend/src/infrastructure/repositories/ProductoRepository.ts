// ═══════════════════════════════════════════════════════════
// REPOSITORIO: Productos
// ═══════════════════════════════════════════════════════════

import { supabase } from '../database/supabase';
import { Producto, ProductoConRelaciones } from '../../domain/entities/Producto';

export class ProductoRepository {

    // Buscar producto por código de barras (PUNTO DE VENTA)
    async buscarPorCodigoBarras(codigoBarras: string): Promise<ProductoConRelaciones | null> {
        const { data, error } = await supabase
            .from('productos')
            .select(`
        *,
        categorias(nombre),
        proveedores(nombre_empresa)
      `)
            .eq('codigo_barras', codigoBarras)
            .single();

        if (error) {
            console.error('Error buscando producto:', error);
            return null;
        }

        return data ? {
            ...data,
            categoria: data.categorias?.nombre,
            proveedor: data.proveedores?.nombre_empresa
        } : null;
    }

    // Listar todos los productos
    async listarTodos(limite: number = 100): Promise<ProductoConRelaciones[]> {
        const { data, error } = await supabase
            .from('productos')
            .select(`
        *,
        categorias(nombre),
        proveedores(nombre_empresa)
      `)
            .limit(limite);

        if (error) {
            console.error('Error listando productos:', error);
            return [];
        }

        return data.map(p => ({
            ...p,
            categoria: p.categorias?.nombre,
            proveedor: p.proveedores?.nombre_empresa
        }));
    }

    // Productos próximos a caducar
    async proximosACaducar(dias: number = 30): Promise<ProductoConRelaciones[]> {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + dias);

        const { data, error } = await supabase
            .from('productos')
            .select(`
        *,
        categorias(nombre)
      `)
            .lte('fecha_caducidad', fechaLimite.toISOString())
            .order('fecha_caducidad', { ascending: true });

        if (error) {
            console.error('Error buscando productos próximos a caducar:', error);
            return [];
        }

        return data.map(p => ({
            ...p,
            categoria: p.categorias?.nombre
        }));
    }

    // Productos con stock bajo
    async stockBajo(minimo: number = 10): Promise<ProductoConRelaciones[]> {
        const { data, error } = await supabase
            .from('productos')
            .select(`
        *,
        categorias(nombre)
      `)
            .lte('stock_actual', minimo)
            .order('stock_actual', { ascending: true });

        if (error) {
            console.error('Error buscando productos con stock bajo:', error);
            return [];
        }

        return data.map(p => ({
            ...p,
            categoria: p.categorias?.nombre
        }));
    }
}
