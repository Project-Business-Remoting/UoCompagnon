import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Globe,
  Lock,
  MapPin,
  Moon,
  Play,
  Sun,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";
import logoImg from "../assets/logo.png";
import "./Welcome.css";

const copy = {
  fr: {
    navHow: "Comment ca marche",
    navFeatures: "Fonctionnalites",
    navAbout: "A propos",
    signIn: "Se connecter",
    pill: "Specialement concu pour les etudiants internationaux",
    heroLine1: "Ton guide intelligent",
    heroLine2: "a l'Universite d'Ottawa",
    heroDesc:
      "UO-Compagnon t'accompagne a chaque etape de ton parcours universitaire du visa a la mi-session avec les bonnes informations, au bon moment.",
    startFree: "Commencer gratuitement",
    seeDemo: "Voir la demo",
    phases: [
      {
        title: "Avant l'arrivee",
        desc: "Visa, logement, assurance sante, budget tout ce qu'il faut preparer avant de partir.",
      },
      {
        title: "Semaine d'accueil",
        desc: "Carte etudiante, uoZone, Brightspace, orientation ton arrivee guidee pas a pas.",
      },
      {
        title: "Premier mois",
        desc: "Plans de cours, tutorat, clubs etudiants, services de sante ton integration reussie.",
      },
      {
        title: "Mi-session",
        desc: "GPA, integrite academique, examens, abandon de cours rester performant.",
      },
    ],
    featureLabel: "Fonctionnalites",
    featureTitle: "Tout ce dont tu as besoin, au bon moment",
    features: [
      {
        title: "Contenu contextuel",
        desc: "Les ressources s'adaptent automatiquement a ta phase d'arrivee et a ton programme.",
      },
      {
        title: "Notifications intelligentes",
        desc: "Des alertes personnalisees basees sur ton calendrier jamais trop tot, jamais trop tard.",
      },
      {
        title: "Suivi de progression",
        desc: "Visualise ou tu en es dans ton parcours et ce qui t'attend a chaque etape.",
      },
      {
        title: "Ressources verifiees",
        desc: "Tous les contenus sont valides par l'administration de uOttawa, fiables et a jour.",
      },
      {
        title: "Concu pour toi",
        desc: "Specialement pense pour les defis uniques des etudiants internationaux au Canada.",
      },
      {
        title: "Acces securise",
        desc: "Connecte-toi avec ton adresse @uottawa.ca ta plateforme, rien que pour toi.",
      },
    ],
    quote:
      "UO-Compagnon m'a evite tellement de stress. Je savais exactement quoi faire chaque semaine, sans me noyer dans les emails et les sites officiels.",
    quoteName: "Amara Diallo",
    quoteProg: "B.Sc. Computer Science - Senegal",
    ctaTitle: "Pret a commencer ton aventure a Ottawa ?",
    ctaText:
      "Rejoins des centaines detudiants internationaux deja accompagnes par UO-Compagnon.",
    ctaBtn: "Creer mon compte",
    footerLeft: "2026 UO-Compagnon - Universite d'Ottawa",
    footerRight: "Plateforme reservee aux etudiants @uottawa.ca",
    themeDark: "Mode sombre",
    themeLight: "Mode clair",
  },
  en: {
    navHow: "How it works",
    navFeatures: "Features",
    navAbout: "About",
    signIn: "Sign in",
    pill: "Built for international students",
    heroLine1: "Your smart guide",
    heroLine2: "to the University of Ottawa",
    heroDesc:
      "UO-Compagnon supports every step of your university journey from visa prep to midterms with the right information at the right time.",
    startFree: "Get started for free",
    seeDemo: "See demo",
    phases: [
      {
        title: "Before arrival",
        desc: "Visa, housing, health insurance, budget everything you need before you leave.",
      },
      {
        title: "Welcome week",
        desc: "Student card, uoZone, Brightspace, orientation your arrival guided step by step.",
      },
      {
        title: "First month",
        desc: "Syllabi, tutoring, student clubs, health services make your transition smooth.",
      },
      {
        title: "Midterm period",
        desc: "GPA, academic integrity, exams, dropping courses stay on track and confident.",
      },
    ],
    featureLabel: "Features",
    featureTitle: "Everything you need, right when you need it",
    features: [
      {
        title: "Contextual content",
        desc: "Resources automatically adapt to your journey phase and your academic program.",
      },
      {
        title: "Smart notifications",
        desc: "Personalized alerts based on your timeline never too early, never too late.",
      },
      {
        title: "Progress tracking",
        desc: "See where you are in your journey and what is next at each stage.",
      },
      {
        title: "Verified resources",
        desc: "All content is validated by uOttawa administration reliable and always up to date.",
      },
      {
        title: "Designed for you",
        desc: "Built around the unique challenges international students face in Canada.",
      },
      {
        title: "Secure access",
        desc: "Sign in with your @uottawa.ca address your platform, your private space.",
      },
    ],
    quote:
      "UO-Compagnon saved me so much stress. I always knew what to do each week without getting lost in emails and official websites.",
    quoteName: "Amara Diallo",
    quoteProg: "B.Sc. Computer Science - Senegal",
    ctaTitle: "Ready to start your Ottawa journey?",
    ctaText:
      "Join hundreds of international students already supported by UO-Compagnon.",
    ctaBtn: "Create my account",
    footerLeft: "2026 UO-Compagnon - University of Ottawa",
    footerRight: "Platform reserved for @uottawa.ca students",
    themeDark: "Dark mode",
    themeLight: "Light mode",
  },
};

const featureIcons = [MapPin, Bell, BarChart3, BookOpen, Globe, Lock];

const Welcome = () => {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLang();
  const ui = copy[lang] || copy.en;

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
              {ui.navHow}
            </a>
            <a className="lp-nav-link" href="#features">
              {ui.navFeatures}
            </a>
            <a className="lp-nav-link" href="#about">
              {ui.navAbout}
            </a>
          </div>

          <div className="lp-nav-actions">
            <button
              className="welcome-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              type="button"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === "dark" ? ui.themeLight : ui.themeDark}</span>
            </button>
            <button
              className="welcome-toggle"
              onClick={toggleLang}
              aria-label={
                lang === "fr"
                  ? "Changer la langue en Anglais"
                  : "Change language to French"
              }
              type="button"
            >
              <Globe size={14} />
              <span>{lang === "fr" ? "EN" : "FR"}</span>
            </button>
            <Link className="lp-nav-cta" to="/login">
              {ui.signIn} <ArrowRight size={14} />
            </Link>
          </div>
        </nav>

        <section className="lp-hero fade-up d1" id="about">
          <div className="lp-hero-pill">
            <div className="lp-dot" />
            {ui.pill}
          </div>
          <h1>
            {ui.heroLine1}
            <br />
            <em>{ui.heroLine2}</em>
          </h1>
          <p>{ui.heroDesc}</p>
          <div className="lp-hero-actions">
            <Link className="lp-btn-primary" to="/register">
              {ui.startFree} <ArrowRight size={16} />
            </Link>
            <a className="lp-btn-secondary" href="#features">
              <Play size={16} /> {ui.seeDemo}
            </a>
          </div>
        </section>

        <div className="lp-phases fade-up d2" id="how-it-works">
          {ui.phases.map((phase, index) => (
            <div className="lp-phase-card" key={phase.title}>
              <div className={`lp-phase-num pn${index + 1}`}>{index + 1}</div>
              <div className="lp-phase-title">{phase.title}</div>
              <div className="lp-phase-desc">{phase.desc}</div>
            </div>
          ))}
        </div>

        <section className="lp-features-section fade-up d3" id="features">
          <div className="lp-section-label">{ui.featureLabel}</div>
          <h2 className="lp-section-title">{ui.featureTitle}</h2>
          <div className="lp-features">
            {ui.features.map((feature, index) => {
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
            <p className="lp-quote-text">"{ui.quote}"</p>
            <div className="lp-quote-author">
              <div className="lp-quote-avatar">A</div>
              <div>
                <div className="lp-quote-name">{ui.quoteName}</div>
                <div className="lp-quote-prog">{ui.quoteProg}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-cta fade-up d5">
          <div className="lp-cta-text">
            <h2>{ui.ctaTitle}</h2>
            <p>{ui.ctaText}</p>
          </div>
          <Link className="lp-cta-btn" to="/register">
            {ui.ctaBtn} <ArrowRight size={14} />
          </Link>
        </section>

        <footer className="lp-footer fade-up d6">
          <span className="lp-footer-text">{ui.footerLeft}</span>
          <span className="lp-footer-text">{ui.footerRight}</span>
        </footer>

        <a className="lp-admin-link fade-up d6" href="http://localhost:5174">
          Admin portal
        </a>
      </div>
    </div>
  );
};

export default Welcome;
