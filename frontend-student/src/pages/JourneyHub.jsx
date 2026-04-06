import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { fetchRelevantContents } from "../services/api";
import "./JourneyHub.css";

// Catégories exactes du seed
const CATEGORIES = ["Administrative", "Academic", "Student Life", "Health"];

const PRIORITY_ORDER = { "High": 1, "Medium": 2, "Low": 3 };
const PHASE_ORDER = ["Before Arrival", "Welcome Week", "First Month", "Mid-Term"];

const JourneyHub = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters and sorting
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("priority"); // default sort
  
  const { t, lang } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRelevantContents();
        setContents(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return <div className="loading-screen">{t("common.loading")}</div>;
  if (error) return <div className="error-message">{error}</div>;

  // 1. Filter by category
  let filtered = activeFilter === "all"
    ? contents
    : contents.filter((c) => c.category === activeFilter);

  // 2. Filter by search query
  if (searchQuery.trim() !== "") {
    const lowerQuery = searchQuery.toLowerCase();
    filtered = filtered.filter(c => {
      const tObj = c.title || {};
      const dObj = c.description || {};
      const titleStr = String(tObj[lang] || tObj.en || c.title || "");
      const descStr = String(dObj[lang] || dObj.en || c.description || "");
      
      return titleStr.toLowerCase().includes(lowerQuery) || 
             descStr.toLowerCase().includes(lowerQuery);
    });
  }

  // 3. Sort
  filtered.sort((a, b) => {
    if (sortBy === "priority") {
      const pA = PRIORITY_ORDER[a.priority] || 99;
      const pB = PRIORITY_ORDER[b.priority] || 99;
      return pA - pB;
    } else if (sortBy === "phase") {
      const pA = PHASE_ORDER.indexOf(a.step);
      const pB = PHASE_ORDER.indexOf(b.step);
      // Tri du plus récent au plus ancien (inversé)
      return pB - pA;
    } else if (sortBy === "alpha") {
      const titleA = a.title?.[lang] || a.title?.en || a.title || "";
      const titleB = b.title?.[lang] || b.title?.en || b.title || "";
      return titleA.localeCompare(titleB);
    }
    return 0;
  });

  return (
    <div className="hub">
      <div className="hub-header">
        <h1>{t("hub.title")}</h1>
        <span className="hub-count">
          {filtered.length}{" "}
          {filtered.length > 1 ? t("hub.countPlural") : t("hub.countSingular")}
        </span>
      </div>

      {/* Search and Sort controls */}
      <div className="hub-controls" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="hub-search" style={{ flex: '1', position: 'relative', minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder={t("hub.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem 0.75rem 2.5rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              background: 'var(--card-bg)', 
              color: 'var(--text-color)' 
            }}
          />
        </div>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ 
            padding: '0.75rem 1rem', 
            borderRadius: '8px', 
            border: '1px solid var(--border-color)', 
            background: 'var(--card-bg)', 
            color: 'var(--text-color)',
            minWidth: '200px'
          }}
        >
          <option value="priority">{t("hub.sortPriority")}</option>
          <option value="phase">{t("hub.sortPhase")}</option>
          <option value="alpha">{t("hub.sortAlpha")}</option>
        </select>
      </div>

      {/* Filters */}
      <div className="hub-filters">
        <button
          className={`hub-filter ${activeFilter === "all" ? "hub-filter--active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          {t("hub.filterAll")}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`hub-filter ${activeFilter === cat ? "hub-filter--active" : ""}`}
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
                <h2 className="hub-card-title">{content.title?.[lang] || content.title?.en || content.title}</h2>
                <span
                  className={`badge ${content.priority === "High" ? "badge-primary" : content.priority === "Medium" ? "badge-warning" : "badge-tertiary"}`}
                >
                  {t(`common.priority.${content.priority}`)}
                </span>
              </div>

              <p className="hub-card-desc">{content.description?.[lang] || content.description?.en || content.description}</p>

              <div className="hub-card-meta">
                <span className="badge badge-tertiary">{content.category}</span>
                <span className="hub-card-step">{content.step}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="hub-empty">{t("hub.noContents")}</p>
      )}
    </div>
  );
};

export default JourneyHub;
