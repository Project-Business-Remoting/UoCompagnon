import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Globe,
  Lock,
  MapPin,
  Moon,
  Sun,
} from "lucide-react";
import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";
import { useLang } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";
import "./Welcome.css";

const featureIcons = [MapPin, Bell, BarChart3, BookOpen, Globe, Lock];
const adminPortalUrl =
  import.meta.env.VITE_ADMIN_PORTAL_URL || "http://localhost:5174";

const Welcome = () => {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const phases = t("welcomeLanding.phases");
  const features = t("welcomeLanding.features");

  return (
    <div className="welcome-page">
      <div className="lp">
        <nav className="lp-nav fade-up">
          <div className="lp-brand">
            <div className="lp-logo" aria-hidden="true">
              <img src={logoImg} alt="UO-Compagnon logo" />
            </div>
            <span className="lp-brand-text">UO-Compagnon</span>
          </div>

          <div className="lp-nav-links">
            <a className="lp-nav-link" href="#how-it-works">
              {t("welcomeLanding.navHow")}
            </a>
            <a className="lp-nav-link" href="#features">
              {t("welcomeLanding.navFeatures")}
            </a>
            <a className="lp-nav-link" href="#about">
              {t("welcomeLanding.navAbout")}
            </a>
          </div>

          <div className="lp-nav-actions">
            <button
              className="welcome-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? t("common.aria.switchToLight")
                  : t("common.aria.switchToDark")
              }
              type="button"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              <span>
                {theme === "dark"
                  ? t("welcomeLanding.themeLight")
                  : t("welcomeLanding.themeDark")}
              </span>
            </button>
            <button
              className="welcome-toggle"
              onClick={toggleLang}
              aria-label={
                lang === "fr"
                  ? t("common.aria.toEnglish")
                  : t("common.aria.toFrench")
              }
              type="button"
            >
              <Globe size={14} />
              <span>{lang === "fr" ? "EN" : "FR"}</span>
            </button>
            <Link className="lp-nav-cta" to="/login">
              {t("welcomeLanding.signIn")} <ArrowRight size={14} />
            </Link>
          </div>
        </nav>

        <section className="lp-hero fade-up d1" id="about">
          <div className="lp-hero-pill">
            <div className="lp-dot" />
            {t("welcomeLanding.pill")}
          </div>
          <h1>
            {t("welcomeLanding.heroLine1")}
            <br />
            <em>{t("welcomeLanding.heroLine2")}</em>
          </h1>
          <p>{t("welcomeLanding.heroDesc")}</p>
          <div className="lp-hero-actions">
            <Link className="lp-btn-primary" to="/register">
              {t("welcomeLanding.startFree")} <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <div className="lp-phases fade-up d2" id="how-it-works">
          {(Array.isArray(phases) ? phases : []).map((phase, index) => (
            <div className="lp-phase-card" key={phase.title}>
              <div className={`lp-phase-num pn${index + 1}`}>{index + 1}</div>
              <div className="lp-phase-title">{phase.title}</div>
              <div className="lp-phase-desc">{phase.desc}</div>
            </div>
          ))}
        </div>

        <section className="lp-features-section fade-up d3" id="features">
          <div className="lp-section-label">
            {t("welcomeLanding.featureLabel")}
          </div>
          <h2 className="lp-section-title">
            {t("welcomeLanding.featureTitle")}
          </h2>
          <div className="lp-features">
            {(Array.isArray(features) ? features : []).map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <article className="lp-feature" key={feature.title}>
                  <div className={`lp-feature-icon fi${index + 1}`}>
                    <Icon size={16} />
                  </div>
                  <div className="lp-feature-title">{feature.title}</div>
                  <div className="lp-feature-text">{feature.desc}</div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="lp-quote-section fade-up d4">
          <div className="lp-quote">
            <p className="lp-quote-text">"{t("welcomeLanding.quote")}"</p>
            <div className="lp-quote-author">
              <div className="lp-quote-avatar">A</div>
              <div>
                <div className="lp-quote-name">
                  {t("welcomeLanding.quoteName")}
                </div>
                <div className="lp-quote-prog">
                  {t("welcomeLanding.quoteProg")}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-cta fade-up d5">
          <div className="lp-cta-text">
            <h2>{t("welcomeLanding.ctaTitle")}</h2>
            <p>{t("welcomeLanding.ctaText")}</p>
          </div>
          <Link className="lp-cta-btn" to="/register">
            {t("welcomeLanding.ctaBtn")} <ArrowRight size={14} />
          </Link>
        </section>

        <footer className="lp-footer fade-up d6">
          <span className="lp-footer-text">
            {t("welcomeLanding.footerLeft")}
          </span>
          <span className="lp-footer-text">
            {t("welcomeLanding.footerRight")}
          </span>
        </footer>

        <a className="lp-admin-link fade-up d6" href={adminPortalUrl}>
          {t("welcomeLanding.adminPortal")}
        </a>
      </div>
    </div>
  );
};

export default Welcome;
