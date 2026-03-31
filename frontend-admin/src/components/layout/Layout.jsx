import { Menu } from "lucide-react";
import { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useSocket from "../../hooks/useSocket";
import { Toast, playNotifSound } from "../ui/Toast";
import AdminSidebar from "./AdminSidebar";
import "./Layout.css";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // WebSocket: listen for new questions from students
  useSocket({
    onQuestion: (data) => {
      addToast({
        title: "Nouveau message",
        message: `De : ${data.author}`,
        type: data.type === "Anonymous" ? "warning" : "info",
        onClick: () => navigate("/questions"),
      });
    },
  });

  return (
    <div className="layout">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="layout-main">
        <header className="layout-mobile-header">
          <button
            className="layout-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
          <span className="layout-mobile-logo">
            <span style={{ color: "var(--primary)" }}>UO</span>-Compagnon Admin
          </span>
        </header>
        <div className="layout-content">
          <Outlet />
        </div>
      </main>

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default Layout;
