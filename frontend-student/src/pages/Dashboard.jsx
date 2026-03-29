import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fetchDashboard } from '../services/api';
import { useLang } from '../context/LangContext';
import PhaseStepper from '../components/dashboard/PhaseStepper';
import './Dashboard.css';

const PHASE_DESCRIPTIONS = {
  fr: {
    "Avant l'arrivée": "Prepare ton arrivee au Canada et a l'Universite d'Ottawa.",
    "Semaine d'accueil": "Decouvre le campus, active tes services et rencontre la communaute.",
    "Premier mois": "Installe-toi dans tes cours, explore les services et construis ta routine.",
    "Mi-session": "Prepare tes examens, verifie ton GPA et planifie la suite.",
  },
  en: {
    "Avant l'arrivée": "Prepare for your arrival in Canada and at the University of Ottawa.",
    "Semaine d'accueil": "Discover the campus, activate your services and meet the community.",
    "Premier mois": "Get settled into your courses, explore services, and build your routine.",
    "Mi-session": "Prepare for exams, check your GPA, and plan ahead.",
  },
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { lang, t } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const dashboard = await fetchDashboard();
        setData(dashboard);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading-screen">{t('common.loading')}</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!data) return null;

  const { user, phase, contents, notifications } = data;
  const phaseDescription = PHASE_DESCRIPTIONS[lang]?.[phase.current] || '';

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-greeting">
          {t('dashboard.greeting')}, {user.name}
        </h1>
        <p className="dashboard-subtitle">
          {user.program} · {phase.current}
        </p>
      </div>

      {/* Phase Stepper */}
      <div className="card dashboard-stepper-card">
        <PhaseStepper currentPhaseIndex={phase.phaseIndex} t={t} />

        {/* Progress Bar */}
        <div className="dashboard-progress">
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${phase.progress}%` }}
            />
          </div>
          <span className="dashboard-progress-text">{phase.progress}%</span>
        </div>
      </div>

      {/* Phase Description */}
      <div className="card dashboard-phase-card">
        <h2 className="dashboard-phase-title">{phase.current}</h2>
        <p className="dashboard-phase-desc">{phaseDescription}</p>
      </div>

      {/* Grid: Priority Contents + Recent Notifications */}
      <div className="dashboard-grid">
        {/* Priority Contents */}
        <div className="card dashboard-section">
          <div className="dashboard-section-header">
            <h2>{t('dashboard.priorityContents')}</h2>
            <Link to="/hub" className="dashboard-view-all">
              {t('dashboard.viewAll')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="dashboard-list">
            {contents.priority.length > 0 ? (
              contents.priority.slice(0, 4).map((content) => (
                <div key={content._id} className="dashboard-list-item dashboard-list-item--clickable" onClick={() => navigate(`/hub/${content._id}`)}>
                  <div className="dashboard-list-info">
                    <span className="dashboard-list-title">{content.title}</span>
                    <span className="dashboard-list-category">{content.category}</span>
                  </div>
                  <span className={`badge ${content.priority === 'Prioritaire' ? 'badge-primary' : 'badge-tertiary'}`}>
                    {t(`common.priority.${content.priority}`)}
                  </span>
                </div>
              ))
            ) : (
              <p className="dashboard-empty">{t('hub.noContents')}</p>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="card dashboard-section">
          <div className="dashboard-section-header">
            <h2>{t('dashboard.recentNotifications')}</h2>
            <Link to="/notifications" className="dashboard-view-all">
              {t('dashboard.viewAll')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="dashboard-list">
            {notifications.smart.length > 0 ? (
              notifications.smart.slice(0, 4).map((notif) => (
                <div key={notif._id} className="dashboard-list-item dashboard-notif-item">
                  <span className={`dashboard-notif-dot dashboard-notif-dot--${notif.type}`} />
                  <div className="dashboard-list-info">
                    <span className="dashboard-list-title">{notif.title}</span>
                    <span className="dashboard-list-category">{notif.message}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="dashboard-empty">{t('notifications.noNotifications')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
