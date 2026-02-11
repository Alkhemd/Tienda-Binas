import { useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  BarChart3, Database, Settings, LogOut, Store
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import Clientes from './pages/Clientes';
import Reportes from './pages/Reportes';
import IndicesSQL from './pages/IndicesSQL';

type Page = 'dashboard' | 'productos' | 'ventas' | 'clientes' | 'reportes' | 'indices';

const navItems: { id: Page; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'productos', label: 'Productos', icon: Package },
  { id: 'ventas', label: 'Ventas', icon: ShoppingCart },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'indices', label: 'Índices SQL', icon: Database },
];

function App() {
  const [page, setPage] = useState<Page>('dashboard');

  function renderPage() {
    switch (page) {
      case 'dashboard': return <Dashboard />;
      case 'productos': return <Productos />;
      case 'ventas': return <Ventas />;
      case 'clientes': return <Clientes />;
      case 'reportes': return <Reportes />;
      case 'indices': return <IndicesSQL />;
      default: return <Dashboard />;
    }
  }

  return (
    <div className="app-container">
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
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
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

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
