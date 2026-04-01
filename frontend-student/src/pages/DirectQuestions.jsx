import { useEffect, useState } from "react";
import { useLang } from "../context/LangContext";
import { createQuestion, getMyQuestions } from "../services/api";
import useSocket from "../hooks/useSocket";
import "./Questions.css";

const DirectQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const { t } = useLang();

  useSocket({
    onQuestionReplied: (updatedQuestion) => {
      // Ignorer si la question reçue d'un websocket concerne une question anonyme (car on est sur la page direct)
      if (updatedQuestion.isAnonymous) return;
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q._id === updatedQuestion._id ? updatedQuestion : q
        )
      );
    },
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await getMyQuestions();
      // Filter out anonymous questions from this view if we wanted to visually separate them,
      // but let's just show explicit direct questions
      setQuestions(data.filter((q) => !q.isAnonymous));
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
      setMsg(t("questions.submittedDirect"));
      setError(""); // Clear error
      setSubject("");
      setContent("");
      loadQuestions(); // refresh
      setTimeout(() => setMsg(""), 5000);
    } catch {
      setError(t("questions.submitError"));
      setMsg("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container questions-page">
      <h1 className="questions-title">{t("questions.directTitle")}</h1>
      <p className="questions-desc">{t("questions.directDesc")}</p>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card form-card">
        <form onSubmit={handleSubmit} className="form-group">
          <input
            type="text"
            placeholder={t("questions.subjectPlaceholderDirect")}
            className="form-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            placeholder={t("questions.contentPlaceholderDirect")}
            className="form-input"
            rows="5"
            style={{ resize: "vertical" }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? t("questions.sending") : t("questions.sendDirect")}
          </button>
        </form>
      </div>

      <h2 style={{ marginTop: "2.5rem", marginBottom: "1rem" }}>
        {t("questions.historyDirect")}
      </h2>
      {questions.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>
          {t("questions.emptyDirect")}
        </p>
      ) : (
        <div className="history-list">
          {questions.map((q) => (
            <div
              key={q._id}
              className="card history-card"
              style={{ marginBottom: "1rem" }}
            >
              <div
                className="history-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <h3 style={{ margin: 0 }}>{q.subject}</h3>
                <span
                  className={`badge ${q.status === "Answered" ? "badge-success" : "badge-warning"}`}
                >
                  {t(`questions.status.${q.status}`) ===
                  `questions.status.${q.status}`
                    ? q.status
                    : t(`questions.status.${q.status}`)}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  marginBottom: "1rem",
                }}
              >
                {q.content}
              </p>

              {q.status === "Answered" && (
                <div
                  style={{
                    background: "var(--bg-color)",
                    padding: "1rem",
                    borderRadius: "6px",
                    borderLeft: "4px solid var(--primary)",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "var(--primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {t("questions.adminResponse")}
                  </strong>
                  <p style={{ margin: 0, fontSize: "0.95rem" }}>{q.answer}</p>
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
