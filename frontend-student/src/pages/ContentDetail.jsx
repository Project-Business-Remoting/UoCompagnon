import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag } from 'lucide-react';
import { useLang } from '../context/LangContext';
import './ContentDetail.css';

const API_BASE = '/api';

const ContentDetail = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t, lang } = useLang();

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('uo_token');
        const res = await fetch(`${API_BASE}/contents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const found = data.find((c) => c._id === id);
        if (found) {
          setContent(found);
        } else {
          setError('Content not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="loading-screen">{t('common.loading')}</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!content) return null;

  return (
    <div className="content-detail">
      {/* Back link */}
      <Link to="/hub" className="content-detail-back">
        <ArrowLeft size={18} />
        Back to contents
      </Link>

      {/* Title */}
      <h1 className="content-detail-title">{content.title?.[lang] || content.title?.en || content.title}</h1>

      {/* Meta */}
      <div className="content-detail-meta">
        <span className={`badge ${content.priority === 'High' ? 'badge-primary' : content.priority === 'Medium' ? 'badge-warning' : 'badge-tertiary'}`}>
          {content.priority}
        </span>
        <span className="badge badge-tertiary">{content.category}</span>
        <span className="content-detail-step">{content.step}</span>
      </div>

      {/* Description / Introduction */}
      <div className="content-detail-intro">
        <p><strong>{content.description?.[lang] || content.description?.en || content.description}</strong></p>
      </div>

      {/* Article Body */}
      {content.articleBody && (
        <div className="card content-detail-body">
          <p>{content.articleBody?.[lang] || content.articleBody?.en || content.articleBody}</p>
        </div>
      )}

      {/* Details (services, contacts) */}
      {content.details && (
        <div className="content-detail-sections">
          {content.details.availableServices && content.details.availableServices.length > 0 && (
            <div className="card content-detail-section">
              <h2>Available Services</h2>
              <ul className="content-detail-list">
                {content.details.availableServices.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {content.details.emergencyContacts && content.details.emergencyContacts.length > 0 && (
            <div className="card content-detail-section content-detail-section--alert">
              <h2>Emergency Contacts</h2>
              <ul className="content-detail-list content-detail-list--contacts">
                {content.details.emergencyContacts.map((c, i) => (
                  <li key={i}>
                    <strong>{c.name}</strong> : {c.phone}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {content.tags && content.tags.length > 0 && (
        <div className="content-detail-tags">
          {content.tags.map((tag, i) => (
            <span key={i} className="content-detail-tag">
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentDetail;
