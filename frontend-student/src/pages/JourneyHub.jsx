import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRelevantContents } from '../services/api';
import { useLang } from '../context/LangContext';
import './JourneyHub.css';

// Catégories exactes du seed
const CATEGORIES = ['Administrative', 'Academic', 'Student Life', 'Health'];

const JourneyHub = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { t } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRelevantContents();
        setContents(data);
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

  const filtered = activeFilter === 'all'
    ? contents
    : contents.filter((c) => c.category === activeFilter);

  return (
    <div className="hub">
      <div className="hub-header">
        <h1>{t('hub.title')}</h1>
        <span className="hub-count">{filtered.length} {filtered.length > 1 ? 'contenus' : 'contenu'}</span>
      </div>

      {/* Filters */}
      <div className="hub-filters">
        <button
          className={`hub-filter ${activeFilter === 'all' ? 'hub-filter--active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          {t('hub.filterAll')}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`hub-filter ${activeFilter === cat ? 'hub-filter--active' : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {filtered.length > 0 ? (
        <div className="hub-grid">
          {filtered.map((content) => (
            <div
              key={content._id}
              className="card hub-card"
              onClick={() => navigate(`/hub/${content._id}`)}
            >
              <div className="hub-card-header">
                <h2 className="hub-card-title">{content.title}</h2>
                <span className={`badge ${content.priority === 'High' ? 'badge-primary' : content.priority === 'Medium' ? 'badge-warning' : 'badge-tertiary'}`}>
                  {content.priority}
                </span>
              </div>

              <p className="hub-card-desc">
                {content.description}
              </p>

              <div className="hub-card-meta">
                <span className="badge badge-tertiary">{content.category}</span>
                <span className="hub-card-step">{content.step}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="hub-empty">{t('hub.noContents')}</p>
      )}
    </div>
  );
};

export default JourneyHub;
