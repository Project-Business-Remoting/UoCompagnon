import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Send } from 'lucide-react';
import { fetchNotifications, createNotificationApi, deleteNotificationApi } from '../services/api';
import { useLang } from '../context/LangContext';
import './ContentManagement.css'; // On réutilise le style de contenu

const STEPS = ["Before Arrival", "Welcome Week", "First Month", "Mid-Term", "All Students"];
const TYPES = ["info", "warning", "success"];

const initialForm = {
  title: { fr: '', en: '' },
  message: { fr: '', en: '' },
  type: TYPES[0],
  relatedStep: STEPS[0],
};

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [formLang, setFormLang] = useState('fr');

  const { lang, t } = useLang();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData(initialForm);
    setFormLang('fr');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialForm);
    setError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (['title', 'message'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          [formLang]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      await createNotificationApi(formData);
      closeModal();
      loadNotifications();
    } catch (err) {
      // User-friendly error message
      let errorMessage = err.message;
      if (err.message.includes("validation failed")) {
        errorMessage = lang === 'fr' 
          ? "Erreur de validation : Veuillez vous assurer d'avoir rempli le titre et le message dans l'autre langue."
          : "Validation error: Please make sure you have filled out the title and message in both languages.";
      }
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      await deleteNotificationApi(id);
      loadNotifications();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && notifications.length === 0) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="admin-contents">
      <div className="admin-header-row">
        <h1>{t('admin.notifications')}</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Send size={18} /> {t('admin.broadcastNotification')}
        </button>
      </div>

      {error && !isModalOpen && <div className="error-message">{error}</div>}

      <div className="card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.title')}</th>
              <th>{t('admin.targetPhase')}</th>
              <th>{t('admin.type')}</th>
              <th>{t('admin.date')}</th>
              <th className="th-actions">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">{t('admin.noNotifications')}</td>
              </tr>
            ) : (
              notifications.map((notif) => (
                <tr key={notif._id}>
                  <td className="font-semibold">{notif.title?.[lang] || notif.title?.fr || notif.title}</td>
                  <td>{notif.relatedStep}</td>
                  <td>
                    <span className={`badge badge-${notif.type === 'error' ? 'danger' : notif.type === 'warning' ? 'warning' : 'info'}`}>
                      {notif.type}
                    </span>
                  </td>
                  <td>{notif.date}</td>
                  <td className="td-actions">
                    <button className="action-btn action-delete" onClick={() => handleDelete(notif._id)} aria-label="Delete Notification" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>{t('admin.broadcastNew')}</h2>
              <button className="modal-close" aria-label="Close modal" onClick={closeModal}><X size={20} /></button>
            </div>
            
            {error && <div className="error-message mb-4">{error}</div>}

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button 
                className={`btn ${formLang === 'fr' ? 'btn-primary' : 'btn-outline'}`} 
                onClick={() => setFormLang('fr')}
              >
                {t('admin.french')}
              </button>
              <button 
                className={`btn ${formLang === 'en' ? 'btn-primary' : 'btn-outline'}`} 
                onClick={() => setFormLang('en')}
              >
                {t('admin.english')}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">{t('admin.notifTitle')} ({formLang.toUpperCase()})</label>
                <input 
                  type="text" name="title" className="form-input" 
                  value={formData.title[formLang]} onChange={handleFormChange} required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('admin.messageDetails')} ({formLang.toUpperCase()})</label>
                <textarea 
                  name="message" className="form-input form-textarea" rows="3"
                  value={formData.message[formLang]} onChange={handleFormChange} required 
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">{t('admin.targetPhase')}</label>
                  <select name="relatedStep" className="form-input form-select" value={formData.relatedStep} onChange={handleFormChange}>
                    {STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
                <div className="form-group flex-1">
                  <label className="form-label">{t('admin.priorityType')}</label>
                  <select name="type" className="form-input form-select" value={formData.type} onChange={handleFormChange}>
                    {TYPES.map(tp => <option key={tp} value={tp}>{tp}</option>)}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModal} disabled={saving}>{t('admin.cancel')}</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? t('admin.sending') : t('admin.sendBroadcast')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;
