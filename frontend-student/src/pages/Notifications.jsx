import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { fetchSmartNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';
import { useLang } from '../context/LangContext';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLang();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSmartNotifications();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      // Smart notifications ne peuvent pas être marquées comme lues
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      // Silencieux
    }
  };

  if (loading) return <div className="loading-screen">{t('common.loading')}</div>;
  if (error) return <div className="error-message">{error}</div>;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notifs">
      <div className="notifs-header">
        <div>
          <h1>{t('notifications.title')}</h1>
          {unreadCount > 0 && (
            <span className="notifs-unread">{unreadCount} non lue(s)</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline" onClick={handleMarkAllRead}>
            <CheckCircle size={16} />
            {t('notifications.markAllRead')}
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="notifs-list">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`card notifs-item ${notif.isRead ? 'notifs-item--read' : ''}`}
            >
              <div className="notifs-item-left">
                <span className={`notifs-dot notifs-dot--${notif.type}`} />
                <div className="notifs-item-content">
                  <div className="notifs-item-top">
                    <h3 className="notifs-item-title">{notif.title}</h3>
                    <span className={`badge ${notif.isSmartNotification ? 'badge-tertiary' : 'badge-info'}`}>
                      {notif.isSmartNotification
                        ? t('notifications.smartBadge')
                        : t('notifications.systemBadge')}
                    </span>
                  </div>
                  <p className="notifs-item-message">{notif.message}</p>
                  <span className="notifs-item-step">{notif.relatedStep}</span>
                </div>
              </div>

              {!notif.isRead && !notif.isSmartNotification && (
                <button
                  className="notifs-mark-btn"
                  onClick={() => handleMarkRead(notif._id)}
                  title={t('notifications.markRead')}
                >
                  <CheckCircle size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="notifs-empty">{t('notifications.noNotifications')}</p>
      )}
    </div>
  );
};

export default Notifications;
