import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Eye, EyeOff, Globe } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lang, setLang] = useState('en');

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
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
        <button className="auth-toggle" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>
          <Globe size={16} />
          <span>{lang === 'fr' ? 'EN' : 'FR'}</span>
        </button>
      </div>

      <div className="auth-container">
        <div className="auth-logo">
          <img src={logoImg} alt="UO-Compagnon Logo" style={{ height: '120px', marginBottom: '0.5rem' }} />
        </div>

        <div className="auth-card">
          <h2 className="auth-title">Login</h2>
          <p className="auth-description">Access your UO-Compagnon Admin space</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" className="form-input"
                placeholder="admin@uottawa.ca"
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? '...' : 'Sign In'}
            </button>
          </form>



          <p className="auth-switch" style={{ marginTop: '2rem' }}>
            Need help? <a href="#" className="auth-link" style={{ color: 'var(--primary)' }}>Contact Support</a>
          </p>
        </div>

        <p className="auth-footer">2026 University of Ottawa — UO-Compagnon v1.0</p>
      </div>
    </div>
  );
};

export default AdminLogin;
