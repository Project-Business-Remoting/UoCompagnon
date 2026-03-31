import { useState, useEffect } from 'react';
import { getAllQuestions, replyToQuestion } from '../services/api';
import useSocket from '../hooks/useSocket';
import './QuestionsManagement.css';

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

  // Écoute des nouvelles questions pour mettre à jour la liste en temps réel
  useSocket({
    onQuestion: (newQuestion) => {
      setQuestions((prevQuestions) => {
        // Optionnel : s'assurer qu'on n'ajoute pas un doublon
        if (prevQuestions.some(q => q._id === newQuestion._id)) {
          return prevQuestions;
        }
        return [newQuestion, ...prevQuestions];
      });
    },
  });

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
      loadQuestions();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading questions...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-questions">
      <div className="admin-header-row">
        <h1>Questions Management</h1>
        <span className="admin-question-count">
          {questions.length} question{questions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card">
        {questions.length === 0 ? (
          <div className="admin-empty-state">
            <p className="admin-empty">No questions have been submitted yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop: Table */}
            <div className="admin-table-wrap questions-desktop">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Author</th>
                    <th>Program</th>
                    <th>Status</th>
                    <th className="th-actions">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map(q => (
                    <tr key={q._id} className="admin-table-row-clickable" onClick={() => handleReplyClick(q)}>
                      <td className="admin-table-name">{q.subject}</td>
                      <td>{q.isAnonymous ? 'Anonymous' : (q.author?.name || 'Unknown')}</td>
                      <td className="text-muted">{q.isAnonymous ? 'N/A' : (q.author?.program || 'N/A')}</td>
                      <td>
                        <span className={`badge ${q.status === 'Pending' ? 'badge-warning' : 'badge-success'}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="td-actions">
                        <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); handleReplyClick(q); }}>
                          {q.status === 'Pending' ? 'Reply' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: Card list */}
            <div className="questions-mobile">
              {questions.map(q => (
                <div key={q._id} className="question-mobile-card" onClick={() => handleReplyClick(q)}>
                  <div className="question-mobile-header">
                    <span className="question-mobile-subject">{q.subject}</span>
                    <span className={`badge ${q.status === 'Pending' ? 'badge-warning' : 'badge-success'}`}>
                      {q.status}
                    </span>
                  </div>
                  <div className="question-mobile-meta">
                    <span>{q.isAnonymous ? 'Anonymous' : (q.author?.name || 'Unknown')}</span>
                    <span className="text-muted">{q.isAnonymous ? '' : (q.author?.program || '')}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Reply Modal */}
      {replyingTo && (
        <div className="modal-overlay" onClick={() => setReplyingTo(null)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reply to Question</h2>
              <button className="modal-close" onClick={() => setReplyingTo(null)} aria-label="Close modal">✕</button>
            </div>

            <div className="question-context">
              <div className="question-context-row">
                <strong>From:</strong> {replyingTo.isAnonymous ? 'Anonymous' : replyingTo.author?.name}
              </div>
              <div className="question-context-row">
                <strong>Subject:</strong> {replyingTo.subject}
              </div>
              <p className="question-context-body">"{replyingTo.content}"</p>
            </div>

            <form onSubmit={handleReplySubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Your Response</label>
                <textarea 
                  className="form-input form-textarea" 
                  rows="5"
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type the official answer here... The student will be notified."
                />
              </div>
              <div className="modal-actions">
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

