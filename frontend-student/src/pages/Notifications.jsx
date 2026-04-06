import { CheckCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import {
  deleteNotification,
  fetchSmartNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/api";
import {
  deleteSmartNotif,
  markAllSmartAsRead,
  markSmartAsRead,
  processNotifications,
} from "../utils/notificationUtils";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t, lang } = useLang();
  const contextParams = useOutletContext();
  const setNotificationCount = contextParams?.setNotificationCount;
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSmartNotifications();
        // Add actionUrl for phase-related notifications (redirect to /hub)
        const PHASE_STEPS = ["Before Arrival", "Welcome Week", "First Month", "Mid-Term", "All Students"];
        const enriched = data.map(n => {
          if (!n.actionUrl && n.relatedStep && PHASE_STEPS.includes(n.relatedStep)) {
            return { ...n, actionUrl: '/hub' };
          }
          return n;
        });
        const { processed, unreadCount } = processNotifications(enriched);
        setNotifications(processed);
        setNotificationCount?.(unreadCount);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setNotificationCount]);

  const handleMarkRead = async (id) => {
    const notif = notifications.find((n) => n._id === id);
    if (!notif) return;

    try {
      if (notif.isSmartNotification) {
        markSmartAsRead(id);
      } else {
        await markNotificationRead(id);
      }

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setNotificationCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      markAllSmartAsRead(notifications);

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setNotificationCount?.(0);
    } catch {
      // Silencieux
    }
  };

  const handleDelete = async (id) => {
    const notif = notifications.find((n) => n._id === id);
    if (!notif) return;

    try {
      if (notif.isSmartNotification) {
        deleteSmartNotif(id);
      } else {
        await deleteNotification(id);
      }

      // Supprimer du tableau et decrémenter si non lu !
      setNotifications((prev) => {
        if (!notif.isRead) {
          setNotificationCount?.((count) => Math.max(0, count - 1));
        }
        return prev.filter((n) => n._id !== id);
      });
    } catch {
      alert("Error deleting notification");
    }
  };

  if (loading)
    return <div className="loading-screen">{t("common.loading")}</div>;
  if (error) return <div className="error-message">{error}</div>;

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const hasUnreadSystem = notifications.some(
    (n) => !n.isRead && !n.isSmartNotification,
  );

  return (
    <div className="notifs">
      <div className="notifs-header">
        <div>
          <h1>{t("notifications.title")}</h1>
          {unreadCount > 0 && (
            <span className="notifs-unread">
              {unreadCount}{" "}
              {unreadCount > 1
                ? t("notifications.unreadPlural")
                : t("notifications.unread")}
            </span>
          )}
        </div>
        {(hasUnreadSystem ||
          notifications.some((n) => n.isSmartNotification && !n.isRead)) && (
          <button className="btn btn-outline" onClick={handleMarkAllRead}>
            <CheckCircle size={16} />
            {t("notifications.markAllRead")}
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="notifs-list">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`card notifs-item ${notif.isRead ? "notifs-item--read" : ""}`}
              style={{ cursor: notif.actionUrl ? 'pointer' : 'default', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onClick={() => {
                if (notif.actionUrl) {
                  navigate(notif.actionUrl);
                }
              }}
            >
              <div className="notifs-item-left">
                <span className={`notifs-dot notifs-dot--${notif.type}`} />
                <div className="notifs-item-content">
                  <div className="notifs-item-top">
                    <h2 className="notifs-item-title">{notif.title?.[lang] || notif.title?.en || notif.title}</h2>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <span
                        className={`badge ${notif.isSmartNotification ? "badge-tertiary" : "badge-info"}`}
                      >
                        {notif.isSmartNotification
                          ? t("notifications.smartBadge")
                          : t("notifications.systemBadge")}
                      </span>
                      {notif.isRead && (
                        <span
                          className="badge"
                          style={{
                            background: "var(--bg-color)",
                            border: "1px solid var(--border-color)",
                            color: "var(--text-muted)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <CheckCircle size={12} />
                          {t("notifications.readBadge")}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="notifs-item-message">{notif.message?.[lang] || notif.message?.en || notif.message}</p>
                  <div
                    className="notifs-item-footer"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "0.75rem",
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    <span>{notif.relatedStep}</span>
                    <span>{notif.date}</span>
                  </div>
                </div>
              </div>

              <div
                className="notifs-item-actions"
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                }}
              >
                {!notif.isRead && (
                  <button
                    className="notifs-mark-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkRead(notif._id);
                    }}
                    title={t("notifications.markRead")}
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                <button
                  className="notifs-mark-btn"
                  style={{
                    color: "var(--danger)",
                    background: "var(--danger-light)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notif._id);
                  }}
                  title={t("notifications.delete")}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="notifs-empty">{t("notifications.noNotifications")}</p>
      )}
    </div>
  );
};

export default Notifications;
