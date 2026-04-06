import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { fetchAllFAQs, createFAQ, updateFAQ, deleteFAQ } from '../services/api';
import { useLang } from '../context/LangContext';
import './ContentManagement.css';

const initialForm = {
  question: { fr: '', en: '' },
  answer: { fr: '', en: '' },
  order: 0
};

const FaqManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [formLang, setFormLang] = useState('fr');

  const { t, lang } = useLang();

  useEffect(() => { loadFAQs(); }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const data = await fetchAllFAQs();
      setFaqs(data);
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

  const openEditModal = (faq) => {
    setEditingId(faq._id);
    const extract = (field) => {
      if (typeof field === 'string') return { fr: field, en: field };
      return { fr: field?.fr || '', en: field?.en || '' };
    };
    setFormData({
      question: extract(faq.question),
      answer: extract(faq.answer),
      order: faq.order || 0
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
    if (['question', 'answer'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: { ...prev[name], [formLang]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await updateFAQ(editingId, formData);
      } else {
        await createFAQ(formData);
      }
      closeModal();
      loadFAQs();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(lang === 'fr' ? 'Supprimer cette FAQ ?' : 'Delete this FAQ?')) return;
    try {
      await deleteFAQ(id);
      loadFAQs();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && faqs.length === 0) return <div className="loading-screen">{t('common.loading')}</div>;

  return (
    <div className="admin-contents">
      <div className="admin-header-row">
        <h1>{t('admin.faqManagement')}</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> {t('admin.addFaq')}
        </button>
      </div>

      {error && !isModalOpen && <div className="error-message">{error}</div>}

      <div className="card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t('admin.faqQuestion')}</th>
              <th>{t('admin.faqAnswer')}</th>
              <th className="th-actions">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">{t('admin.noFaq')}</td>
              </tr>
            ) : (
              faqs.map((faq, idx) => (
                <tr key={faq._id}>
                  <td>{idx + 1}</td>
                  <td className="font-semibold" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {faq.question?.[lang] || faq.question?.fr || ''}
                  </td>
                  <td style={{ maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {faq.answer?.[lang] || faq.answer?.fr || ''}
                  </td>
                  <td className="td-actions">
                    <button className="action-btn action-edit" onClick={() => openEditModal(faq)} title={lang === 'fr' ? 'Modifier' : 'Edit'}>
                      <Edit size={16} />
                    </button>
                    <button className="action-btn action-delete" onClick={() => handleDelete(faq._id)} title={lang === 'fr' ? 'Supprimer' : 'Delete'}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h2>{editingId ? t('admin.editFaq') : t('admin.newFaq')}</h2>
              <button className="modal-close" aria-label="Close" onClick={closeModal}><X size={20} /></button>
            </div>

            {error && <div className="error-message mb-4">{error}</div>}

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button className={`btn ${formLang === 'fr' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFormLang('fr')}>
                {t('admin.french')}
              </button>
              <button className={`btn ${formLang === 'en' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFormLang('en')}>
                {t('admin.english')}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">{t('admin.faqQuestion')} ({formLang.toUpperCase()})</label>
                <textarea
                  name="question" className="form-input form-textarea" rows="2"
                  value={formData.question[formLang]} onChange={handleFormChange} required
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.faqAnswer')} ({formLang.toUpperCase()})</label>
                <textarea
                  name="answer" className="form-input form-textarea" rows="4"
                  value={formData.answer[formLang]} onChange={handleFormChange} required
                />
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

export default FaqManagement;
