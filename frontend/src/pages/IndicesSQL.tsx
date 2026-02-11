import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface QueryResult {
    query: string;
    data: Record<string, unknown>[] | null;
    error: string | null;
    time: number;
}

const EXAMPLE_QUERIES = [
    {
        name: 'Top 10 productos más caros',
        query: 'SELECT id_producto, nombre, precio_venta, stock_actual FROM productos ORDER BY precio_venta DESC LIMIT 10',
    },
    {
        name: 'Ventas por tipo de pago',
        query: 'SELECT tipo_pago, COUNT(*) as cantidad, SUM(total) as total FROM ventas GROUP BY tipo_pago',
    },
    {
        name: 'Clientes con más saldo pendiente',
        query: 'SELECT id_cliente, nombre, saldo_pendiente, limite_credito FROM clientes WHERE saldo_pendiente > 0 ORDER BY saldo_pendiente DESC LIMIT 10',
    },
    {
        name: 'Productos con stock bajo (< 10)',
        query: 'SELECT id_producto, nombre, stock_actual, precio_venta FROM productos WHERE stock_actual < 10 ORDER BY stock_actual LIMIT 10',
    },
    {
        name: 'Ventas más recientes',
        query: 'SELECT id_venta, fecha_venta, total, tipo_pago, id_cliente FROM ventas ORDER BY fecha_venta DESC LIMIT 10',
    },
    {
        name: 'Conteo general de tablas',
        query: `SELECT 'productos' as tabla, COUNT(*) as total FROM productos UNION ALL SELECT 'ventas', COUNT(*) FROM ventas UNION ALL SELECT 'clientes', COUNT(*) FROM clientes UNION ALL SELECT 'empleados', COUNT(*) FROM empleados UNION ALL SELECT 'categorias', COUNT(*) FROM categorias UNION ALL SELECT 'proveedores', COUNT(*) FROM proveedores`,
    },
];

export default function IndicesSQL() {
    const [customQuery, setCustomQuery] = useState('');
    const [results, setResults] = useState<QueryResult[]>([]);
    const [running, setRunning] = useState(false);

    async function runQuery(sql: string) {
        setRunning(true);
        const start = performance.now();
        const { data, error } = await supabase.rpc('run_query', { query_text: sql }).single();
        const time = performance.now() - start;

        // If RPC doesn't exist, fallback - just show the SQL
        if (error) {
            // Try direct select for simple queries
            let result: Record<string, unknown>[] | null = null;
            let errMsg: string | null = null;

            try {
                // Simple approach: use supabase from() for predefined queries
                const { data: d, error: e } = await supabase.from('productos').select('*').limit(1);
                if (e) errMsg = e.message;
                else result = d as Record<string, unknown>[];
            } catch {
                errMsg = 'No se pudo ejecutar la consulta directamente. Usa Supabase SQL Editor.';
            }

            setResults(prev => [{
                query: sql,
                data: result,
                error: errMsg || 'Esta consulta debe ejecutarse desde el SQL Editor de Supabase. Las consultas de ejemplo se muestran como referencia.',
                time,
            }, ...prev]);
        } else {
            setResults(prev => [{
                query: sql,
                data: Array.isArray(data) ? data as Record<string, unknown>[] : [data as Record<string, unknown>],
                error: null,
                time,
            }, ...prev]);
        }
        setRunning(false);
    }

    return (
        <>
            <div className="page-header">
                <h1><Database size={28} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} /> Índices SQL</h1>
                <p>Consultas SQL de ejemplo y referencia para la base de datos</p>
            </div>

            {/* Example Queries */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-header">
                    <h3>Consultas de Ejemplo</h3>
                    <span className="card-header-badge badge-blue">{EXAMPLE_QUERIES.length} consultas</span>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {EXAMPLE_QUERIES.map((q, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                background: 'var(--bg-primary)',
                                borderRadius: '10px',
                                border: '1px solid var(--border)',
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.9rem' }}>{q.name}</div>
                                    <code style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', background: '#eff6ff', padding: '2px 6px', borderRadius: 4, wordBreak: 'break-all' }}>
                                        {q.query}
                                    </code>
                                </div>
                                <button
                                    onClick={() => {
                                        setCustomQuery(q.query);
                                        navigator.clipboard.writeText(q.query);
                                    }}
                                    className="nav-item"
                                    style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#eff6ff', color: 'var(--accent-blue)', borderRadius: 8 }}
                                >
                                    Copiar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Custom Query */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
                <div className="card-header">
                    <h3>Editor SQL</h3>
                </div>
                <div className="card-body">
                    <textarea
                        value={customQuery}
                        onChange={(e) => setCustomQuery(e.target.value)}
                        placeholder="Escribe tu consulta SQL aquí..."
                        style={{
                            width: '100%',
                            minHeight: '120px',
                            padding: '1rem',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border)',
                            borderRadius: '10px',
                            color: 'var(--text-primary)',
                            resize: 'vertical',
                            marginBottom: '1rem',
                        }}
                    />
                    <button
                        onClick={() => runQuery(customQuery)}
                        disabled={running || !customQuery.trim()}
                        className="nav-item"
                        style={{ width: 'auto', padding: '0.6rem 1.5rem', fontSize: '0.85rem', background: running ? '#cbd5e1' : 'var(--accent-blue)', color: 'white', borderRadius: 8, marginBottom: '1rem', cursor: running ? 'not-allowed' : 'pointer' }}
                    >
                        {running ? '⏳ Ejecutando...' : '▶ Ejecutar'}
                    </button>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                        💡 Tip: Copia las consultas de ejemplo arriba o escribe las tuyas. Para ejecutar consultas complejas, usa el SQL Editor de Supabase.
                    </p>

                    {results.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>Resultados</h4>
                            {results.map((r, i) => (
                                <div key={i} style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        {r.error ? <XCircle size={16} color="var(--accent-red)" /> : <CheckCircle size={16} color="var(--accent-green)" />}
                                        <code style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.query.substring(0, 80)}...</code>
                                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.time.toFixed(0)}ms</span>
                                    </div>
                                    {r.error && <p style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }}>{r.error}</p>}
                                    {r.data && r.data.length > 0 && (
                                        <pre style={{ fontSize: '0.75rem', overflow: 'auto', maxHeight: '200px' }}>
                                            {JSON.stringify(r.data, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
}
