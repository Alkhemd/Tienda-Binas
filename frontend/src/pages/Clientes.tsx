import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Cliente {
    id_cliente: number;
    nombre: string;
    telefono: string;
    limite_credito: number;
    saldo_pendiente: number;
}

export default function Clientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => { loadClientes(); }, []);

    async function loadClientes() {
        setLoading(true);
        const { count } = await supabase.from('clientes').select('*', { count: 'exact', head: true });
        setTotal(count || 0);
        const { data } = await supabase.from('clientes').select('*').order('id_cliente', { ascending: false }).limit(50);
        setClientes(data || []);
        setLoading(false);
    }

    async function buscar(term: string) {
        setSearch(term);
        if (!term.trim()) { loadClientes(); return; }
        const { data } = await supabase.from('clientes').select('*').ilike('nombre', `%${term}%`).order('nombre').limit(50);
        setClientes(data || []);
    }

    function formatCurrency(v: number) {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v);
    }

    return (
        <>
            <div className="page-header">
                <h1><Users size={28} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} /> Clientes</h1>
                <p>Directorio de clientes — {total.toLocaleString()} registros</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
                <div className="card-header">
                    <h3>Listado de Clientes</h3>
                    <span className="card-header-badge badge-purple">{total.toLocaleString()} total</span>
                </div>
                <div className="card-body">
                    <div className="search-container">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre de cliente..."
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
                                    <th>Nombre</th>
                                    <th>Teléfono</th>
                                    <th>Límite Crédito</th>
                                    <th>Saldo Pendiente</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map((c) => (
                                    <tr key={c.id_cliente}>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{c.id_cliente}</td>
                                        <td style={{ fontWeight: 600 }}>{c.nombre}</td>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{c.telefono || '—'}</td>
                                        <td className="price">{formatCurrency(c.limite_credito)}</td>
                                        <td style={{ fontWeight: 600, color: c.saldo_pendiente > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                                            {formatCurrency(c.saldo_pendiente)}
                                        </td>
                                    </tr>
                                ))}
                                {clientes.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>Sin resultados</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>
        </>
    );
}
