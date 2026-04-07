import { Menu } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSocketContext } from "../../context/SocketContext";
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

  // WebSocket: listen for new questions from students via the global context
  const { lastMessage, setLastMessage, lastNotification, setLastNotification } = useSocketContext();

  useEffect(() => {
    if (lastMessage) {
      const displayAuthor = lastMessage.authorName || lastMessage.author?.name || (typeof lastMessage.author === 'string' ? lastMessage.author : 'Étudiant');
      addToast({
        title: "Nouveau message",
        message: `De : ${displayAuthor}`,
        type: lastMessage.type === "Anonymous" ? "warning" : "info",
        onClick: () => navigate("/questions"),
      });
      setLastMessage(null);
    }
  }, [lastMessage, addToast, navigate, setLastMessage]);

  useEffect(() => {
    if (lastNotification) {
      addToast({
        title: lastNotification.title,
        message: lastNotification.message,
        type: lastNotification.type || "info",
        onClick: () => navigate("/notifications"),
      });
      setLastNotification(null);
    }
  }, [lastNotification, addToast, navigate, setLastNotification]);

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
