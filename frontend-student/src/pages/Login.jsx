import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
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
      {/* Top bar */}
      <div className="auth-topbar">
        <button className="auth-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? t('sidebar.lightMode') : t('sidebar.darkMode')}</span>
        </button>
        <button className="auth-toggle" onClick={toggleLang}>
          <Globe size={16} />
          <span>{lang === 'fr' ? 'EN' : 'FR'}</span>
        </button>
      </div>

      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <h1 className="auth-logo-title">
            <span className="auth-logo-uo">UO</span>-Compagnon
          </h1>
          <p className="auth-logo-subtitle">STUDENT ACADEMIC COMPANION</p>
        </div>

        {/* Form */}
        <div className="auth-card">
          <h2 className="auth-title">{t('login.title')}</h2>
          <p className="auth-description">{t('login.subtitle')}</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">{t('login.email')}</label>
              <input
                type="email"
                className="form-input"
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('login.password')}</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? '...' : t('login.submit')}
            </button>
          </form>

          <button
            className="btn btn-outline btn-block"
            onClick={() => window.location.href = 'http://localhost:5174'}
          >
            {t('login.adminLink')}
          </button>

          <p className="auth-switch">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="auth-link">{t('login.register')}</Link>
          </p>
        </div>

        {/* Footer */}
        <p className="auth-footer">{t('login.footer')}</p>
      </div>
    </div>
  );
};

export default Login;
