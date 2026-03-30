import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { createQuestion, getMyQuestions } from '../services/api';
import './Questions.css';

const DirectQuestions = () => {
  const { t } = useLang();
  const [questions, setQuestions] = useState([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await getMyQuestions();
      // Filter out anonymous questions from this view if we wanted to visually separate them,
      // but let's just show explicit direct questions
      setQuestions(data.filter(q => !q.isAnonymous));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !content) return;
    setLoading(true);
    try {
      await createQuestion({ subject, content, isAnonymous: false });
      setMsg("Question submitted successfully!");
      setError(''); // Clear error
      setSubject('');
      setContent('');
      loadQuestions(); // refresh
      setTimeout(() => setMsg(''), 5000);
    } catch (err) {
      setError("Error submitting the question. Please try again.");
      setMsg('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container questions-page">
      <h1 className="questions-title">Direct Questions</h1>
      <p className="questions-desc">Ask your questions directly to the administration. These questions are attached to your profile.</p>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card form-card">
        <form onSubmit={handleSubmit} className="form-group">
          <input 
            type="text" 
            placeholder="Subject (e.g., Missing document)" 
            className="form-input" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
          />
          <textarea 
            placeholder="Describe your issue..." 
            className="form-input" 
            rows="5" 
            style={{ resize: 'vertical' }}
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Send to Administration'}
          </button>
        </form>
      </div>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>My Question History</h2>
      {questions.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>You haven't asked any direct questions yet.</p>
      ) : (
        <div className="history-list">
          {questions.map(q => (
            <div key={q._id} className="card history-card" style={{ marginBottom: '1rem' }}>
              <div className="history-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>{q.subject}</h3>
                <span className={`badge ${q.status === 'Answered' ? 'badge-success' : 'badge-warning'}`}>
                  {q.status}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{q.content}</p>
              
              {q.status === 'Answered' && (
                <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid var(--primary)' }}>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Admin Response</strong>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectQuestions;
