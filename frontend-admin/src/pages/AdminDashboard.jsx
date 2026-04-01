import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Bell, X, Calendar, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { fetchAdminDashboard } from '../services/api';
import useSocket from '../hooks/useSocket';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const dashboard = await fetchAdminDashboard();
        setData(dashboard);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Écoute des nouvelles questions pour mettre à jour la liste en temps réel
  useSocket({
    onQuestion: (newQuestion) => {
      setData((prevData) => {
        // Si les données ne sont pas encore chargées, on ne fait rien
        if (!prevData) return prevData;
        // Éviter les doublons
        if (prevData.recentQuestions?.some(q => q._id === newQuestion._id)) {
          return prevData;
        }
        return {
          ...prevData,
          recentQuestions: [newQuestion, ...(prevData.recentQuestions || [])],
        };
      });
    },
  });

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!data) return null;

  const { stats, recentUsers, recentQuestions = [] } = data;

  return (
    <div className="admin-dash">
      <h1>Administrator Dashboard</h1>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="card admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--users"><Users size={24} /></div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.totalUsers}</span>
            <span className="admin-stat-label">Total Students</span>
          </div>
        </div>
        <div className="card admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--contents"><FileText size={24} /></div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.totalContents}</span>
            <span className="admin-stat-label">Published Contents</span>
          </div>
        </div>
      </div>

      <div className="admin-grid-v2">
        {/* Recent Questions (Notifications for Admin) */}
        <div className="card admin-section">
          <div className="admin-section-header">
            <h2>Recent Questions</h2>
            <Link to="/questions" className="admin-view-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="admin-list">
            {recentQuestions.length > 0 ? (
              recentQuestions.map((q) => (
                <div key={q._id} className="admin-list-item admin-notif-item">
                  <span className={`admin-notif-dot admin-notif-dot--${(q.status || 'pending').toLowerCase().replace(' ', '-')}`} title={q.status} />
                  <div className="admin-list-info">
                    <div className="admin-list-title-row">
                      <span className="admin-list-title">{q.subject}</span>
                      <span className={`badge badge-sm ${(q.type || 'Direct') === 'Anonymous' ? 'badge-tertiary' : 'badge-primary'}`}>
                        {q.type}
                      </span>
                    </div>
                    <span className="admin-list-author">From: {q.author?.name || q.author || 'Anonymous'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="admin-empty-state">
                <p className="admin-empty">No recent questions documented yet.</p>
                <Link to="/questions" className="btn btn-tertiary btn-sm" style={{ marginTop: '0.5rem' }}>View Management</Link>
              </div>
            )}
          </div>
        </div>

        {/* Recently Registered Students */}
        <div className="card admin-section">
          <h2>Recently Registered Students</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Program</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u._id} onClick={() => setSelectedUser(u)} className="admin-table-row-clickable">
                    <td className="admin-table-name">{u.name}</td>
                    <td>{u.program}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString('en-CA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content card admin-user-modal">
            <div className="modal-header">
              <h2>Student Profile</h2>
              <button className="modal-close" aria-label="Close modal" onClick={() => setSelectedUser(null)}><X size={20} /></button>
            </div>
            <div className="admin-user-details">
              <div className="admin-user-avatar">{selectedUser.name.charAt(0)}</div>
              <h3>{selectedUser.name}</h3>
              <p className="admin-user-email">{selectedUser.email}</p>
              
              <div className="admin-user-grid">
                <div className="admin-user-item">
                  <BookOpen size={16} />
                  <span><strong>Program:</strong> {selectedUser.program}</span>
                </div>
                <div className="admin-user-item">
                  <Clock size={16} />
                  <span><strong>Current Phase:</strong> <span className="badge badge-primary">{selectedUser.currentStep || 'Unknown'}</span></span>
                </div>
                <div className="admin-user-item">
                  <Calendar size={16} />
                  <span><strong>Arrival:</strong> {new Date(selectedUser.arrivalDate).toLocaleDateString('en-CA')}</span>
                </div>
                <div className="admin-user-item">
                  <Calendar size={16} />
                  <span><strong>Start of Classes:</strong> {new Date(selectedUser.classStartDate).toLocaleDateString('en-CA')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
