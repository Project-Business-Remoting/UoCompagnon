import { Link } from 'react-router-dom';
import { User, Shield, Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
import logoImg from '../assets/logo.png';
import './Welcome.css';

const Welcome = () => {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  return (
    <div className="welcome-page">
      <div className="welcome-topbar">
        <button
          className="welcome-toggle"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span>
            {theme === "dark" ? t("welcome.lightMode") : t("welcome.darkMode")}
          </span>
        </button>
        <button
          className="welcome-toggle"
          onClick={toggleLang}
          aria-label={lang === "fr" ? "Changer la langue en Anglais" : "Change language to French"}
        >
          <Globe size={16} />
          <span>{lang === "fr" ? "EN" : "FR"}</span>
        </button>
      </div>

      <main className="welcome-container" aria-labelledby="welcome-title">
        
        {/* En-tête avec Logo animé */}
        <div className="welcome-header">
          <img
            src={logoImg}
            alt="UO-Compagnon Home Logo"
            className="welcome-logo"
            width="180"
            height="120"
            loading="eager"
            style={{ width: "180px", height: "120px" }}
          />
          <h1 className="welcome-title" id="welcome-title">{t("welcome.title")}</h1>
          <p className="welcome-subtitle">{t("welcome.subtitle")}</p>
        </div>

        {/* Portails d'entrée */}
        <div className="welcome-cards">
          
          {/* Carte Étudiant */}
          <Link to="/login" className="welcome-card student-card">
            <div className="welcome-card-icon">
              <User size={48} />
            </div>
            <h2>{t('welcome.studentTitle')}</h2>
            <p>{t('welcome.studentDesc')}</p>
            <span className="welcome-card-btn">{t('welcome.enterBtn')} →</span>
          </Link>

          {/* Carte Admin */}
          <a href="http://localhost:5174" className="welcome-card admin-card">
            <div className="welcome-card-icon">
              <Shield size={48} />
            </div>
            <h2>{t('welcome.adminTitle')}</h2>
            <p>{t('welcome.adminDesc')}</p>
            <span className="welcome-card-btn">{t('welcome.accessBtn')} →</span>
          </a>

        </div>
        
        <div className="welcome-footer">
          <p>{t('welcome.footer')}</p>
        </div>

      </main>
    </div>
  );
};

export default Welcome;
