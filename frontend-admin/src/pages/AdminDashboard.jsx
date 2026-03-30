import { useState, useEffect } from 'react';
import { Users, FileText, Bell } from 'lucide-react';
import { fetchAdminDashboard } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div className="loading-screen">Chargement...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!data) return null;

  const { stats, distributions, recentUsers } = data;

  return (
    <div className="admin-dash">
      <h1>Dashboard Administrateur</h1>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="card admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--users"><Users size={24} /></div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.totalUsers}</span>
            <span className="admin-stat-label">Étudiants</span>
          </div>
        </div>
        <div className="card admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--contents"><FileText size={24} /></div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.totalContents}</span>
            <span className="admin-stat-label">Contenus</span>
          </div>
        </div>
        <div className="card admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--notifs"><Bell size={24} /></div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.totalNotifications}</span>
            <span className="admin-stat-label">Notifications</span>
          </div>
        </div>
      </div>

      {/* Distributions */}
      <div className="admin-grid">
        {/* By Phase */}
        <div className="card admin-distrib">
          <h2>Distribution par Phase</h2>
          <div className="admin-bars">
            {Object.entries(distributions.byStep || {}).map(([step, count]) => (
              <div key={step} className="admin-bar-group">
                <div className="admin-bar-label">
                  <span>{step}</span>
                  <span className="admin-bar-count">{count}</span>
                </div>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill admin-bar-fill--phase"
                    style={{ width: `${Math.max((count / (stats.totalContents || 1)) * 100, 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Category */}
        <div className="card admin-distrib">
          <h2>Distribution par Catégorie</h2>
          <div className="admin-bars">
            {Object.entries(distributions.byCategory || {}).map(([cat, count]) => (
              <div key={cat} className="admin-bar-group">
                <div className="admin-bar-label">
                  <span>{cat}</span>
                  <span className="admin-bar-count">{count}</span>
                </div>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill admin-bar-fill--cat"
                    style={{ width: `${Math.max((count / (stats.totalContents || 1)) * 100, 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card admin-recent">
        <h2>Derniers inscrits</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Programme</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u._id}>
                  <td className="admin-table-name">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.program}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString('fr-CA')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
