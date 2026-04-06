import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { fetchAllContents, createContent, updateContent, deleteContent } from '../services/api';
import { useLang } from '../context/LangContext';
import './ContentManagement.css';

const CATEGORIES = ['Administrative', 'Academic', 'Student Life', 'Health'];
const STEPS = ["Before Arrival", "Welcome Week", "First Month", "Mid-Term"];
const PRIORITIES = ['High', 'Medium', 'Low'];

const initialForm = {
  title: { fr: '', en: '' },
  description: { fr: '', en: '' },
  articleBody: { fr: '', en: '' },
  category: CATEGORIES[0],
  step: STEPS[0],
  priority: PRIORITIES[0]
};

const ContentManagement = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [formLang, setFormLang] = useState('fr'); // Onglet actuel dans le formulaire

  const { t, lang } = useLang();

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    try {
      setLoading(true);
      const data = await fetchAllContents();
      setContents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setFormLang('fr');
    setIsModalOpen(true);
  };

  const openEditModal = (content) => {
    setEditingId(content._id);
    
    // Fallback pour les old strings ou nouveaux objects
    const extractLang = (field) => {
      if (typeof field === 'string') return { fr: field, en: field };
      return { fr: field?.fr || '', en: field?.en || '' };
    };

    setFormData({
      title: extractLang(content.title),
      description: extractLang(content.description),
      articleBody: extractLang(content.articleBody),
      category: content.category || CATEGORIES[0],
      step: content.step || STEPS[0],
      priority: content.priority || PRIORITIES[0]
    });
    setFormLang('fr');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialForm);
    setEditingId(null);
    setError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (['title', 'description', 'articleBody'].includes(name)) {
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
      if (editingId) {
        await updateContent(editingId, formData);
      } else {
        await createContent(formData);
      }
      closeModal();
      loadContents(); // Refresh list
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    
    try {
      await deleteContent(id);
      loadContents();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && contents.length === 0) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="admin-contents">
      <div className="admin-header-row">
        <h1>{t('admin.contentManagement')}</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> {t('admin.addNewContent')}
        </button>
      </div>

      {error && !isModalOpen && <div className="error-message">{error}</div>}

      <div className="card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.title')}</th>
              <th>{t('admin.category')}</th>
              <th>{t('admin.phase')}</th>
              <th>{t('common.priority.High').split(' ')[0] === 'High' ? 'Priority' : 'Priorité'}</th>
              <th className="th-actions">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {contents.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">{t('admin.noContent')}</td>
              </tr>
            ) : (
              contents.map((content) => (
                <tr key={content._id}>
                  <td className="font-semibold">{content.title?.[lang] || content.title?.fr || content.title}</td>
                  <td><span className="badge badge-tertiary">{content.category}</span></td>
                  <td>{content.step}</td>
                  <td>
                    <span className={`badge ${
                      content.priority === 'High' ? 'badge-primary' : 
                      content.priority === 'Medium' ? 'badge-warning' : 'badge-tertiary'
                    }`}>
                      {t(`common.priority.${content.priority}`)}
                    </span>
                  </td>
                  <td className="td-actions">
                    <button className="action-btn action-edit" onClick={() => openEditModal(content)} aria-label="Edit Content" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn action-delete" onClick={() => handleDelete(content._id)} aria-label="Delete Content" title="Delete">
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
          <div className="modal-content card" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2>{editingId ? t('admin.editContent') : t('admin.newContent')}</h2>
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
                <label className="form-label">{t('admin.title')} ({formLang.toUpperCase()})</label>
                <input 
                  type="text" name="title" className="form-input" 
                  value={formData.title[formLang]} onChange={handleFormChange} required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('admin.description')} ({formLang.toUpperCase()})</label>
                <textarea 
                  name="description" className="form-input form-textarea" rows="2"
                  value={formData.description[formLang]} onChange={handleFormChange} required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('admin.articleBody')} ({formLang.toUpperCase()})</label>
                <textarea 
                  name="articleBody" className="form-input form-textarea" rows="6"
                  value={formData.articleBody[formLang]} onChange={handleFormChange} required 
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">{t('admin.category')}</label>
                  <select name="category" className="form-input form-select" value={formData.category} onChange={handleFormChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div className="form-group flex-1">
                  <label className="form-label">{t('admin.phase')}</label>
                  <select name="step" className="form-input form-select" value={formData.step} onChange={handleFormChange}>
                    {STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('admin.priorityType')}</label>
                <select name="priority" className="form-input form-select" value={formData.priority} onChange={handleFormChange}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModal} disabled={saving}>{t('admin.cancel')}</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? t('admin.saving') : t('admin.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
