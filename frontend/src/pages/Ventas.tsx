import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Venta {
    id_venta: number;
    id_cliente: number;
    id_empleado: number;
    fecha_venta: string;
    total: number;
    tipo_pago: string;
}

export default function Ventas() {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => { loadVentas(); }, []);

    async function loadVentas() {
        setLoading(true);
        const { count } = await supabase.from('ventas').select('*', { count: 'exact', head: true });
        setTotal(count || 0);
        const { data } = await supabase.from('ventas').select('*').order('fecha_venta', { ascending: false }).limit(50);
        setVentas(data || []);
        setLoading(false);
    }

    async function buscar(term: string) {
        setSearch(term);
        if (!term.trim()) { loadVentas(); return; }
        const { data } = await supabase.from('ventas').select('*').ilike('tipo_pago', `%${term}%`).order('fecha_venta', { ascending: false }).limit(50);
        setVentas(data || []);
    }

    function formatCurrency(v: number) {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v);
    }

    const paymentBadge: Record<string, string> = {
        'Efectivo': 'badge-green',
        'Tarjeta': 'badge-blue',
        'Transferencia': 'badge-purple',
    };

    return (
        <>
            <div className="page-header">
                <h1><ShoppingCart size={28} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} /> Ventas</h1>
                <p>Historial completo de ventas — {total.toLocaleString()} registros</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
                <div className="card-header">
                    <h3>Registro de Ventas</h3>
                    <span className="card-header-badge badge-green">{total.toLocaleString()} total</span>
                </div>
                <div className="card-body">
                    <div className="search-container">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por tipo de pago (Efectivo, Tarjeta, Transferencia)..."
                            className="search-input"
                            value={search}
                            onChange={(e) => buscar(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="loading-spinner"><div className="spinner" /></div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Empleado</th>
                                    <th>Tipo Pago</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas.map((v) => (
                                    <tr key={v.id_venta}>
                                        <td style={{ fontWeight: 600 }}>#{v.id_venta}</td>
                                        <td>{new Date(v.fecha_venta).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                        <td>Cliente #{v.id_cliente}</td>
                                        <td>Emp. #{v.id_empleado}</td>
                                        <td>
                                            <span className={`card-header-badge ${paymentBadge[v.tipo_pago] || 'badge-blue'}`}>
                                                {v.tipo_pago}
                                            </span>
                                        </td>
                                        <td className="price" style={{ fontWeight: 700 }}>{formatCurrency(v.total)}</td>
                                    </tr>
                                ))}
                                {ventas.length === 0 && (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>Sin resultados</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>
        </>
    );
}
