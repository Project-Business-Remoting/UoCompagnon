import { Menu } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import { fetchDashboard } from "../../services/api";
import { processNotifications } from "../../utils/notificationUtils";
import { Toast, playNotifSound } from "../ui/Toast";
import useSocket from "../../hooks/useSocket";
import "./Layout.css";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  // Toast helpers
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    playNotifSound();
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // WebSocket: listen for real-time notifications
  useSocket({
    onNotification: (data) => {
      setNotificationCount((prev) => prev + 1);
      // Determine redirect target based on notification type
      const PHASE_STEPS = ["Before Arrival", "Welcome Week", "First Month", "Mid-Term", "All Students"];
      const redirectUrl = data.relatedStep && PHASE_STEPS.includes(data.relatedStep) ? '/hub' : '/notifications';
      addToast({
        title: data.title,
        message: data.message,
        type: data.type || "info",
        onClick: () => {
          navigate(redirectUrl);
        }
      });
    },
  });

  useEffect(() => {
    const loadNotifCount = async () => {
      try {
        const data = await fetchDashboard();
        const allNotifs = [
          ...(data.notifications?.system || []),
          ...(data.notifications?.smart || []),
        ];
        const { unreadCount } = processNotifications(allNotifs);
        setNotificationCount(unreadCount);
      // eslint-disable-next-line no-unused-vars
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
            <img
              src={logoImg}
              alt="UO-Compagnon logo"
              className="layout-mobile-logo-image"
            />
            <span>UO-Compagnon</span>
          </span>
        </header>

        <div className="layout-content">
          <Outlet context={{ setNotificationCount }} />
        </div>
      </main>

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default Layout;

