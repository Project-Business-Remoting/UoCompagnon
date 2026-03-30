import { useState, useEffect } from 'react';
import { getAllQuestions, replyToQuestion } from '../services/api';
import './QuestionsManagement.css'; // Optional custom generic styles or use index.css

const QuestionsManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [replyingTo, setReplyingTo] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await getAllQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyClick = (question) => {
    setReplyingTo(question);
    setAnswerText(question.answer || '');
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!answerText) return;
    setSubmitting(true);
    try {
      await replyToQuestion(replyingTo._id, answerText);
      setReplyingTo(null);
      setAnswerText('');
      loadQuestions(); // refresh list
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading questions...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>Questions Management</h1>
      </div>

      <div className="card">
        {questions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No questions have been submitted yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem' }}>Subject</th>
                  <th style={{ padding: '1rem' }}>Author</th>
                  <th style={{ padding: '1rem' }}>Ext. / Prog.</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {questions.map(q => (
                  <tr key={q._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>{q.subject}</td>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>
                      {q.isAnonymous ? 'Anonymous' : (q.author?.name || 'Unknown')}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {q.isAnonymous ? 'N/A' : (q.author?.program || 'N/A')}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${q.status === 'Pending' ? 'badge-warning' : 'badge-success'}`}>
                        {q.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleReplyClick(q)}
                      >
                        {q.status === 'Pending' ? 'Reply' : 'View / Edit'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {replyingTo && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="modal-content card" style={{ width: '500px', maxWidth: '90%', padding: '2rem' }}>
            <h2>Reply to Question</h2>
            
            <div style={{ margin: '1rem 0', padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
              <strong>From: </strong> {replyingTo.isAnonymous ? 'Anonymous' : replyingTo.author?.name} <br/>
              <strong>Subject: </strong> {replyingTo.subject} <br/><br/>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>"{replyingTo.content}"</p>
            </div>

            <form onSubmit={handleReplySubmit} className="form-group">
              <label className="form-label">Your Response</label>
              <textarea 
                className="form-input" 
                rows="5"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type the official answer here... The student will be notified."
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setReplyingTo(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Sending...' : (replyingTo.status === 'Pending' ? 'Send Reply' : 'Update Reply')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsManagement;
