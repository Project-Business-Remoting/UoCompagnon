import { Search, ChevronDown, Check } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { fetchRelevantContents } from "../services/api";
import "./JourneyHub.css";

const CATEGORIES = ["Administrative", "Academic", "Student Life", "Health"];
const PRIORITY_ORDER = { "High": 1, "Medium": 2, "Low": 3 };
const PHASE_ORDER = ["Before Arrival", "Welcome Week", "First Month", "Mid-Term"];

const JourneyHub = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("priority"); 
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);
  
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SORT_OPTIONS = [
    { value: "priority", label: t("hub.sortPriority") },
    { value: "phase", label: t("hub.sortPhase") },
    { value: "alpha", label: t("hub.sortAlpha") },
  ];

  if (loading)
    return <div className="loading-screen">{t("common.loading")}</div>;
  if (error) return <div className="error-message">{error}</div>;

  let filtered = activeFilter === "all"
    ? contents
    : contents.filter((c) => c.category === activeFilter);

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

  filtered.sort((a, b) => {
    if (sortBy === "priority") {
      const pA = PRIORITY_ORDER[a.priority] || 99;
      const pB = PRIORITY_ORDER[b.priority] || 99;
      return pA - pB;
    } else if (sortBy === "phase") {
      const pA = PHASE_ORDER.indexOf(a.step);
      const pB = PHASE_ORDER.indexOf(b.step);
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

      <div className="hub-controls">
        <div className="hub-search-wrapper">
          <Search className="hub-search-icon" size={20} />
          <input
            type="text"
            className="hub-search-input"
            placeholder={t("hub.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="custom-select-container" ref={sortRef}>
          <div 
            className="custom-select-trigger" 
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            <span>{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
            <ChevronDown size={18} style={{ transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
          </div>
          
          {isSortOpen && (
            <div className="custom-options">
              {SORT_OPTIONS.map(option => (
                <div 
                  key={option.value}
                  className={`custom-option ${sortBy === option.value ? 'active' : ''}`}
                  onClick={() => {
                    setSortBy(option.value);
                    setIsSortOpen(false);
                  }}
                >
                  {sortBy === option.value && <Check size={14} style={{ marginRight: '8px' }} />}
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
