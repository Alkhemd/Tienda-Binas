import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ReportData {
    totalVentas: number;
    totalIngresos: number;
    totalProductos: number;
    totalClientes: number;
    ventasPorPago: { tipo_pago: string; count: number; total: number }[];
    topProductos: { id_producto: number; nombre: string; stock_actual: number; precio_venta: number }[];
}

export default function Reportes() {
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadReport(); }, []);

    async function loadReport() {
        setLoading(true);

        const [
            { count: totalProductos },
            { count: totalVentas },
            { count: totalClientes },
            { data: ventasAll },
            { data: topProds },
        ] = await Promise.all([
            supabase.from('productos').select('*', { count: 'exact', head: true }),
            supabase.from('ventas').select('*', { count: 'exact', head: true }),
            supabase.from('clientes').select('*', { count: 'exact', head: true }),
            supabase.from('ventas').select('tipo_pago, total').limit(1000),
            supabase.from('productos').select('id_producto, nombre, stock_actual, precio_venta').order('stock_actual', { ascending: false }).limit(10),
        ]);

        const totalIngresos = ventasAll?.reduce((s: number, v: { total: number }) => s + (v.total || 0), 0) || 0;

        const porPago: Record<string, { count: number; total: number }> = {};
        ventasAll?.forEach((v: { tipo_pago: string; total: number }) => {
            if (!porPago[v.tipo_pago]) porPago[v.tipo_pago] = { count: 0, total: 0 };
            porPago[v.tipo_pago].count++;
            porPago[v.tipo_pago].total += v.total || 0;
        });

        setData({
            totalVentas: totalVentas || 0,
            totalIngresos,
            totalProductos: totalProductos || 0,
            totalClientes: totalClientes || 0,
            ventasPorPago: Object.entries(porPago).map(([tipo_pago, d]) => ({ tipo_pago, ...d })),
            topProductos: topProds || [],
        });
        setLoading(false);
    }

    function formatCurrency(v: number) {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v);
    }

    if (loading) return (
        <>
            <div className="page-header"><h1>Reportes</h1><p>Cargando...</p></div>
            <div className="loading-spinner"><div className="spinner" /></div>
        </>
    );

    if (!data) return null;

    const summaryCards = [
        { icon: ShoppingCart, label: 'Total Ventas', value: data.totalVentas.toLocaleString(), colorClass: 'green' },
        { icon: TrendingUp, label: 'Ingresos', value: formatCurrency(data.totalIngresos), colorClass: 'orange' },
        { icon: Package, label: 'Productos', value: data.totalProductos.toLocaleString(), colorClass: 'blue' },
        { icon: Users, label: 'Clientes', value: data.totalClientes.toLocaleString(), colorClass: 'purple' },
    ];

    return (
        <>
            <div className="page-header">
                <h1><BarChart3 size={28} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} /> Reportes</h1>
                <p>Resumen general del negocio</p>
            </div>

            <div className="stats-grid">
                {summaryCards.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
                        <div className="stat-card-header">
                            <span className="stat-card-label">{s.label}</span>
                            <div className={`stat-card-icon ${s.colorClass}`}><s.icon size={22} /></div>
                        </div>
                        <div className="stat-card-value">{s.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="content-grid">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
                    <div className="card-header">
                        <h3>Ventas por Método de Pago</h3>
                    </div>
                    <div className="card-body">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Método</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                    <th>Porcentaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.ventasPorPago.map((p) => (
                                    <tr key={p.tipo_pago}>
                                        <td style={{ fontWeight: 600 }}>{p.tipo_pago}</td>
                                        <td>{p.count.toLocaleString()}</td>
                                        <td className="price">{formatCurrency(p.total)}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ flex: 1, height: 8, background: 'var(--bg-primary)', borderRadius: 4 }}>
                                                    <div style={{ width: `${(p.count / (data?.totalVentas || 1) * 100)}%`, height: '100%', background: 'var(--accent-blue)', borderRadius: 4 }} />
                                                </div>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{((p.count / (data?.totalVentas || 1)) * 100).toFixed(1)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card">
                    <div className="card-header">
                        <h3>Top 10 Productos (Mayor Stock)</h3>
                    </div>
                    <div className="card-body">
                        {data.topProductos.map((p, i) => (
                            <div key={p.id_producto} className="sale-item">
                                <div className="sale-info">
                                    <div className="sale-avatar" style={{ background: '#eff6ff', color: 'var(--accent-blue)', fontWeight: 700 }}>
                                        {i + 1}
                                    </div>
                                    <div className="sale-details">
                                        <h4>{p.nombre}</h4>
                                        <span>Stock: {p.stock_actual}</span>
                                    </div>
                                </div>
                                <span className="sale-amount positive">{formatCurrency(p.precio_venta)}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </>
    );
}
