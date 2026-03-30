import {
  Bell,
  BookOpen,
  Globe,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  ShieldAlert,
  Sun,
  User,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import { useTheme } from "../../context/ThemeContext";
import "./Sidebar.css";

const Sidebar = ({ notificationCount = 0, isOpen, onClose }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const location = useLocation();

  const navItems = [
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      label: t("sidebar.dashboard"),
    },
    { path: "/hub", icon: BookOpen, label: t("sidebar.contents") },
    { path: "/faq", icon: HelpCircle, label: t("sidebar.faqAdmin") },
    {
      path: "/direct-questions",
      icon: MessageSquare,
      label: t("sidebar.directQuestions"),
    },
    {
      path: "/anonymous-questions",
      icon: ShieldAlert,
      label: t("sidebar.anonymousQuestions"),
    },
    {
      path: "/notifications",
      icon: Bell,
      label: t("sidebar.notifications"),
      badge: notificationCount,
    },
    { path: "/profile", icon: User, label: t("sidebar.profile") },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        {/* Logo */}
        <div
          className="sidebar-logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "-1.1rem",
            marginBottom: "2rem",
            marginLeft: "-0.75rem",
          }}
        >
          <img
            src={logoImg}
            alt="UO-Compagnon Logo"
            style={{ height: "40px", borderRadius: "8px" }}
          />
          <span
            className="sidebar-logo-text"
            style={{
              fontSize: "1.2rem",
              fontWeight: "700",
              whiteSpace: "nowrap",
            }}
          >
            UO-Compagnon
          </span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(({ path, icon: Icon, label, badge }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link--active" : ""}`
              }
              onClick={onClose}
            >
              <Icon size={20} />
              <span>{label}</span>
              {badge > 0 && <span className="sidebar-badge">{badge}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="sidebar-bottom">
          <button className="sidebar-action" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>
              {theme === "dark"
                ? t("sidebar.lightMode")
                : t("sidebar.darkMode")}
            </span>
          </button>

          <button className="sidebar-action" onClick={toggleLang}>
            <Globe size={18} />
            <span>{lang === "fr" ? "EN" : "FR"}</span>
          </button>

          <button
            className="sidebar-action sidebar-action--danger"
            onClick={logout}
          >
            <LogOut size={18} />
            <span>{t("sidebar.logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
