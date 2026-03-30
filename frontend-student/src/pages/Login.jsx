import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Globe, Eye, EyeOff } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
          <img
            src={logoImg}
            alt="UO-Compagnon Logo"
            width="180"
            height="120"
            loading="eager"
            style={{ width: "180px", height: "120px", marginBottom: "0.5rem" }}
          />
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
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? '...' : t('login.submit')}
            </button>
          </form>


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
