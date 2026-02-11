import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Producto {
    id_producto: number;
    codigo_barras: string;
    nombre: string;
    id_categoria: number;
    id_proveedor: number;
    precio_venta: number;
    stock_actual: number;
    fecha_caducidad: string;
}

export default function Productos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => { loadProductos(); }, []);

    async function loadProductos() {
        setLoading(true);
        const { count } = await supabase.from('productos').select('*', { count: 'exact', head: true });
        setTotal(count || 0);
        const { data } = await supabase.from('productos').select('*').order('id_producto', { ascending: false }).limit(50);
        setProductos(data || []);
        setLoading(false);
    }

    async function buscar(term: string) {
        setSearch(term);
        if (!term.trim()) { loadProductos(); return; }
        const { data } = await supabase.from('productos').select('*').ilike('nombre', `%${term}%`).order('nombre').limit(50);
        setProductos(data || []);
    }

    function formatCurrency(v: number) {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v);
    }

    function getStockClass(s: number) {
        if (s > 50) return 'stock-high';
        if (s > 15) return 'stock-medium';
        return 'stock-low';
    }

    return (
        <>
            <div className="page-header">
                <h1><Package size={28} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} /> Productos</h1>
                <p>Gestión completa de productos — {total.toLocaleString()} registros</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
                <div className="card-header">
                    <h3>Inventario de Productos</h3>
                    <span className="card-header-badge badge-blue">{total.toLocaleString()} total</span>
                </div>
                <div className="card-body">
                    <div className="search-container">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre de producto..."
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
                                    <th>Producto</th>
                                    <th>Código Barras</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Caducidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((p) => (
                                    <tr key={p.id_producto}>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{p.id_producto}</td>
                                        <td>
                                            <div className="product-name">{p.nombre}</div>
                                            <div className="product-category">Cat. {p.id_categoria} · Prov. {p.id_proveedor}</div>
                                        </td>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.codigo_barras}</td>
                                        <td className="price">{formatCurrency(p.precio_venta)}</td>
                                        <td>
                                            <span className={`stock-badge ${getStockClass(p.stock_actual)}`}>
                                                {p.stock_actual}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {p.fecha_caducidad ? new Date(p.fecha_caducidad).toLocaleDateString('es-MX') : '—'}
                                        </td>
                                    </tr>
                                ))}
                                {productos.length === 0 && (
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
