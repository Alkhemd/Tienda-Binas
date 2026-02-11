// ═══════════════════════════════════════════════════════════
// REPOSITORIO: Ventas
// ═══════════════════════════════════════════════════════════

import { supabase } from '../database/supabase';
import { Venta, VentaConRelaciones, DetalleVenta } from '../../domain/entities/Venta';

export class VentaRepository {

    // Listar ventas del día
    async ventasDelDia(): Promise<VentaConRelaciones[]> {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('ventas')
            .select(`
        *,
        clientes(nombre),
        empleados(nombre)
      `)
            .gte('fecha_venta', hoy.toISOString())
            .order('fecha_venta', { ascending: false });

        if (error) {
            console.error('Error listando ventas del día:', error);
            return [];
        }

        return data.map(v => ({
            ...v,
            cliente: v.clientes?.nombre,
            empleado: v.empleados?.nombre
        }));
    }

    // Ventas por rango de fechas
    async ventasPorRango(fechaInicio: Date, fechaFin: Date): Promise<VentaConRelaciones[]> {
        const { data, error } = await supabase
            .from('ventas')
            .select(`
        *,
        clientes(nombre),
        empleados(nombre)
      `)
            .gte('fecha_venta', fechaInicio.toISOString())
            .lte('fecha_venta', fechaFin.toISOString())
            .order('fecha_venta', { ascending: false });

        if (error) {
            console.error('Error listando ventas por rango:', error);
            return [];
        }

        return data.map(v => ({
            ...v,
            cliente: v.clientes?.nombre,
            empleado: v.empleados?.nombre
        }));
    }

    // Registrar nueva venta
    async registrarVenta(venta: Omit<Venta, 'id_venta' | 'fecha_venta'>): Promise<number | null> {
        const { data, error } = await supabase
            .from('ventas')
            .insert([venta])
            .select('id_venta')
            .single();

        if (error) {
            console.error('Error registrando venta:', error);
            return null;
        }

        return data?.id_venta || null;
    }

    // Registrar detalle de venta
    async registrarDetalle(detalle: Omit<DetalleVenta, 'id_detalle'>): Promise<boolean> {
        const { error } = await supabase
            .from('detalle_ventas')
            .insert([detalle]);

        if (error) {
            console.error('Error registrando detalle:', error);
            return false;
        }

        return true;
    }
}
