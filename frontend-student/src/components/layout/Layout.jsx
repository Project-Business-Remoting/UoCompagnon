import { Menu } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import { fetchDashboard } from "../../services/api";
import { processNotifications } from "../../utils/notificationUtils";
import { Toast, playNotifSound } from "../ui/Toast";
import { useAuth } from "../../context/AuthContext";
import useSocket from "../../hooks/useSocket";
import { useLang } from "../../context/LangContext";
import "./Layout.css";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [photoUpdateTrigger, setPhotoUpdateTrigger] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang } = useLang();

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    playNotifSound();
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useSocket({
    onNotification: (data) => {
      setNotificationCount((prev) => prev + 1);
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
    onPhotoStatusUpdated: (data) => {
      if (user && String(data.userId) === String(user._id)) {
        // Handle multilingual object or fallback to string
        const titleStr = typeof data.title === 'object' ? (data.title[lang] || data.title.fr) : data.title;
        const messageStr = typeof data.message === 'object' ? (data.message[lang] || data.message.fr) : data.message;
        
        // Define default title based on status
        let defaultTitle = "Mise à jour de la photo";
        let defaultType = "info";
        if (data.status === "verified") {
          defaultTitle = "Photo validée !";
          defaultType = "success";
        } else if (data.status === "rejected") {
          defaultTitle = "Photo refusée";
          defaultType = "error";
        } else if (data.status === "pending") {
          defaultTitle = "Photo envoyée";
          defaultType = "info";
        }

        addToast({
          title: titleStr || defaultTitle,
          message: messageStr || (data.status === "pending" ? "Votre photo est en cours de vérification." : ""),
          type: defaultType,
          onClick: () => {
            navigate("/notifications");
          }
        });
        setPhotoUpdateTrigger(prev => prev + 1);
      }
    }
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
      } catch (err) {
        // Silencieux
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
        <header className="layout-mobile-header">
          <button
            className="layout-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <span className="layout-mobile-logo" style={{ fontSize: '1.2rem', fontWeight: '700' }}>
            <span style={{ color: 'var(--primary)' }}>UO</span>-Compagnon
          </span>
        </header>

        <div className="layout-content">
          <Outlet context={{ setNotificationCount, photoUpdateTrigger }} />
        </div>
      </main>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default Layout;
