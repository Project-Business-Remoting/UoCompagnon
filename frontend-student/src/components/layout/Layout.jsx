import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { fetchDashboard } from '../../services/api';
import { processNotifications } from '../../utils/notificationUtils';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const loadNotifCount = async () => {
      try {
        const data = await fetchDashboard();
        // Combiner système (unread) et smart pour calculer le total réel
        const allNotifs = [
          ...(data.notifications?.system || []),
          ...(data.notifications?.smart || [])
        ];
        const { unreadCount } = processNotifications(allNotifs);
        setNotificationCount(unreadCount);
      } catch (err) {
        // Silencieux — le badge sera juste à 0
      }
    };
    loadNotifCount();
  }, []);

  return (
    <div className="layout">
      <Sidebar
        notificationCount={notificationCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="layout-main">
        {/* Mobile Header */}
        <header className="layout-mobile-header">
          <button
            className="layout-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <span className="layout-mobile-logo">
            <span style={{ color: 'var(--primary)' }}>UO</span>-Compagnon
          </span>
        </header>

        <div className="layout-content">
          <Outlet context={{ setNotificationCount }} />
        </div>
      </main>
    </div>
  );
};

export default Layout;
