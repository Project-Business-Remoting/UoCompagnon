import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { fetchAllContents, createContent, updateContent, deleteContent } from '../services/api';
import './ContentManagement.css';

const CATEGORIES = ['Administratif', 'Académique', 'Vie étudiante', 'Santé'];
const STEPS = ["Avant l'arrivée", "Semaine d'accueil", "Premier mois", "Mi-session"];
const PRIORITIES = ['Prioritaire', 'Moyen', 'Bas'];

const initialForm = {
  title: '',
  description: '',
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
    setIsModalOpen(true);
  };

  const openEditModal = (content) => {
    setEditingId(content._id);
    setFormData({
      title: content.title || '',
      description: content.description || '',
      category: content.category || CATEGORIES[0],
      step: content.step || STEPS[0],
      priority: content.priority || PRIORITIES[0]
    });
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) return;
    
    try {
      await deleteContent(id);
      loadContents();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && contents.length === 0) return <div className="loading-screen">Chargement...</div>;

  return (
    <div className="admin-contents">
      <div className="admin-header-row">
        <h1>Gestion des Contenus</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Nouveau Contenu
        </button>
      </div>

      {error && !isModalOpen && <div className="error-message">{error}</div>}

      <div className="card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Phase</th>
              <th>Priorité</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contents.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">Aucun contenu trouvé.</td>
              </tr>
            ) : (
              contents.map((content) => (
                <tr key={content._id}>
                  <td className="font-semibold">{content.title}</td>
                  <td><span className="badge badge-tertiary">{content.category}</span></td>
                  <td>{content.step}</td>
                  <td>
                    <span className={`badge ${
                      content.priority === 'Prioritaire' ? 'badge-primary' : 
                      content.priority === 'Moyen' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {content.priority}
                    </span>
                  </td>
                  <td className="td-actions">
                    <button className="action-btn action-edit" onClick={() => openEditModal(content)} title="Modifier">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn action-delete" onClick={() => handleDelete(content._id)} title="Supprimer">
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
          <div className="modal-content card">
            <div className="modal-header">
              <h2>{editingId ? 'Modifier le contenu' : 'Nouveau contenu'}</h2>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            
            {error && <div className="error-message mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Titre</label>
                <input 
                  type="text" name="title" className="form-input" 
                  value={formData.title} onChange={handleFormChange} required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  name="description" className="form-input form-textarea" rows="4"
                  value={formData.description} onChange={handleFormChange} required 
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Catégorie</label>
                  <select name="category" className="form-input form-select" value={formData.category} onChange={handleFormChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div className="form-group flex-1">
                  <label className="form-label">Phase</label>
                  <select name="step" className="form-input form-select" value={formData.step} onChange={handleFormChange}>
                    {STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Priorité</label>
                <select name="priority" className="form-input form-select" value={formData.priority} onChange={handleFormChange}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModal} disabled={saving}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
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
