import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-topbar">
        <button className="auth-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
        </button>
      </div>

      <div className="auth-container">
        <div className="auth-logo">
          <h1 className="auth-logo-title">
            <span className="auth-logo-uo">UO</span>-Compagnon
          </h1>
          <p className="auth-logo-subtitle">ADMINISTRATION</p>
        </div>

        <div className="auth-card">
          <h2 className="auth-title">Connexion Admin</h2>
          <p className="auth-description">Accédez au panneau d'administration</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Adresse courriel</label>
              <input
                type="email" className="form-input"
                placeholder="admin@uottawa.ca"
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input
                type="password" className="form-input"
                placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? '...' : 'Se connecter'}
            </button>
          </form>

          <p className="auth-switch">
            <a href="http://localhost:5173" className="auth-link">← Retour à l'espace étudiant</a>
          </p>
        </div>

        <p className="auth-footer">2026 Université d'Ottawa — UO-Compagnon v1.0</p>
      </div>
    </div>
  );
};

export default AdminLogin;
