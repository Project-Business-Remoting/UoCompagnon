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
import { NavLink } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import { useTheme } from "../../context/ThemeContext";
import "./Sidebar.css";

const Sidebar = ({ notificationCount = 0, isOpen, onClose }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

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
            gap: "0.45rem",
            marginBottom: "2rem",
            marginLeft: "-0.5rem"
          }}
        >
          <img
            src={logoImg}
            alt="UO-Compagnon Logo"
            width="45"
            height="32"
            style={{ borderRadius: "8px", objectFit: "cover" }}
          />
          <span
            className="sidebar-logo-text"
            style={{
              fontSize: "1.2rem",
              fontWeight: "700",
              whiteSpace: "nowrap",
              color: "white"
            }}
          >
            UO-Compagnon
          </span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link--active" : ""}`
              }
              onClick={onClose}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="sidebar-bottom">
          <button
            className="sidebar-action"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>
              {theme === "dark"
                ? t("sidebar.lightMode")
                : t("sidebar.darkMode")}
            </span>
          </button>

          <button
            className="sidebar-action"
            onClick={toggleLang}
            aria-label={
              lang === "fr"
                ? "Changer la langue en Anglais"
                : "Change language to French"
            }
          >
            <Globe size={18} />
            <span>{lang === "fr" ? "EN" : "FR"}</span>
          </button>

          <button
            className="sidebar-action sidebar-action--danger"
            onClick={logout}
            aria-label="Logout from your account"
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
