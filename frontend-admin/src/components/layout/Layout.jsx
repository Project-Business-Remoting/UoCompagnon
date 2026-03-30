import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="layout-main">
        <header className="layout-mobile-header">
          <button className="layout-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open Menu"><Menu size={24} /></button>
          <span className="layout-mobile-logo"><span style={{ color: 'var(--primary)' }}>UO</span>-Compagnon Admin</span>
        </header>
        <div className="layout-content"><Outlet /></div>
      </main>
    </div>
  );
};

export default Layout;
