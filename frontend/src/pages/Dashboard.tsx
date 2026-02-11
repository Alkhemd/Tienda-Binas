import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Package, ShoppingCart, Users, TrendingUp,
    LayoutDashboard, Search, BarChart3, Database,
    Store, Settings, LogOut
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Producto {
    id: number;
    nombre: string;
    precio_venta: number;
    stock: number;
    categoria_id: number;
}

interface Venta {
    id: number;
    fecha: string;
    total: number;
    tipo_pago: string;
    cliente_id: number;
}

interface Stats {
    productos: number;
    ventas: number;
    clientes: number;
    ingresos: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats>({ productos: 0, ventas: 0, clientes: 0, ingresos: 0 });
    const [productos, setProductos] = useState<Producto[]>([]);
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);

            const [
                { count: totalProductos },
                { count: totalVentas },
                { count: totalClientes },
                { data: ventasData },
                { data: productosData }
            ] = await Promise.all([
                supabase.from('productos').select('*', { count: 'exact', head: true }),
                supabase.from('ventas').select('*', { count: 'exact', head: true }),
                supabase.from('clientes').select('*', { count: 'exact', head: true }),
                supabase.from('ventas').select('*').order('fecha', { ascending: false }).limit(8),
                supabase.from('productos').select('*').order('id', { ascending: false }).limit(10),
            ]);

            const totalIngresos = ventasData?.reduce((sum: number, v: { total: number }) => sum + (v.total || 0), 0) || 0;

            setStats({
                productos: totalProductos || 0,
                ventas: totalVentas || 0,
                clientes: totalClientes || 0,
                ingresos: totalIngresos,
            });

            setProductos(productosData || []);
            setVentas(ventasData || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function searchProductos() {
        if (!searchTerm.trim()) return;
        const { data } = await supabase
            .from('productos')
            .select('*')
            .ilike('nombre', `%${searchTerm}%`)
            .limit(10);
        if (data) setProductos(data);
    }

    function formatCurrency(value: number) {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
    }

    function formatNumber(value: number) {
        return new Intl.NumberFormat('es-MX').format(value);
    }

    function getStockClass(stock: number) {
        if (stock > 50) return 'stock-high';
        if (stock > 15) return 'stock-medium';
        return 'stock-low';
    }

    function getStockLabel(stock: number) {
        if (stock > 50) return 'Alto';
        if (stock > 15) return 'Medio';
        return 'Bajo';
    }

    const paymentColors: Record<string, string> = {
        'Efectivo': 'var(--accent-green)',
        'Tarjeta': 'var(--accent-blue)',
        'Transferencia': 'var(--accent-purple)',
    };

    const statCards = [
        { icon: Package, label: 'Productos', value: formatNumber(stats.productos), colorClass: 'blue', change: '+12%' },
        { icon: ShoppingCart, label: 'Ventas', value: formatNumber(stats.ventas), colorClass: 'green', change: '+8%' },
        { icon: Users, label: 'Clientes', value: formatNumber(stats.clientes), colorClass: 'purple', change: '+5%' },
        { icon: TrendingUp, label: 'Ingresos', value: formatCurrency(stats.ingresos), colorClass: 'orange', change: '+15%' },
    ];

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <Store size={22} color="white" />
                    </div>
                    <div>
                        <h2>Don Pepe</h2>
                        <span>Sistema POS</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button className="nav-item active">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </button>
                    <button className="nav-item">
                        <Package size={20} />
                        Productos
                    </button>
                    <button className="nav-item">
                        <ShoppingCart size={20} />
                        Ventas
                    </button>
                    <button className="nav-item">
                        <Users size={20} />
                        Clientes
                    </button>
                    <button className="nav-item">
                        <BarChart3 size={20} />
                        Reportes
                    </button>
                    <button className="nav-item">
                        <Database size={20} />
                        Índices SQL
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item">
                        <Settings size={20} />
                        Configuración
                    </button>
                    <button className="nav-item">
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="page-header">
                    <h1>Dashboard</h1>
                    <p>Bienvenido al sistema de punto de venta — datos en tiempo real desde Supabase</p>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="stat-card"
                        >
                            <div className="stat-card-header">
                                <span className="stat-card-label">{stat.label}</span>
                                <div className={`stat-card-icon ${stat.colorClass}`}>
                                    <stat.icon size={22} />
                                </div>
                            </div>
                            <div className="stat-card-value">
                                {loading ? '...' : stat.value}
                            </div>
                            <div className="stat-card-change positive">↑ {stat.change}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="content-grid">
                    {/* Products Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="card"
                    >
                        <div className="card-header">
                            <h3>Productos Recientes</h3>
                            <span className="card-header-badge badge-blue">{formatNumber(stats.productos)} total</span>
                        </div>
                        <div className="card-body">
                            <div className="search-container">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Buscar producto..."
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && searchProductos()}
                                />
                            </div>

                            {loading ? (
                                <div className="loading-spinner"><div className="spinner" /></div>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Precio</th>
                                            <th>Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productos.map((p) => (
                                            <tr key={p.id}>
                                                <td>
                                                    <div className="product-name">{p.nombre}</div>
                                                    <div className="product-category">Cat. {p.categoria_id}</div>
                                                </td>
                                                <td className="price">{formatCurrency(p.precio_venta)}</td>
                                                <td>
                                                    <span className={`stock-badge ${getStockClass(p.stock)}`}>
                                                        {p.stock} — {getStockLabel(p.stock)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </motion.div>

                    {/* Recent Sales */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="card"
                    >
                        <div className="card-header">
                            <h3>Ventas Recientes</h3>
                            <span className="card-header-badge badge-green">{formatNumber(stats.ventas)} total</span>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="loading-spinner"><div className="spinner" /></div>
                            ) : (
                                ventas.map((v) => (
                                    <div key={v.id} className="sale-item">
                                        <div className="sale-info">
                                            <div
                                                className="sale-avatar"
                                                style={{ background: paymentColors[v.tipo_pago] || 'var(--accent-blue)', opacity: 0.2 }}
                                            >
                                                <ShoppingCart
                                                    size={16}
                                                    style={{ color: paymentColors[v.tipo_pago] || 'var(--accent-blue)', opacity: 1 }}
                                                />
                                            </div>
                                            <div className="sale-details">
                                                <h4>Venta #{v.id}</h4>
                                                <span>{v.tipo_pago} · {new Date(v.fecha).toLocaleDateString('es-MX')}</span>
                                            </div>
                                        </div>
                                        <span className="sale-amount positive">{formatCurrency(v.total)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
