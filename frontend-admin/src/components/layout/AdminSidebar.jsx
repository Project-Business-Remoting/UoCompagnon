import {
  FileText,
  Globe,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  Sun,
  Bell,
  Users
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import { useTheme } from "../../context/ThemeContext";
import "./AdminSidebar.css";

const studentPortalWelcomeUrl =
  import.meta.env.VITE_STUDENT_PORTAL_URL || "http://localhost:5173/welcome";

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: t("sidebar.dashboard") },
    { path: "/students", icon: Users, label: t("admin.studentsDirectory") },
    { path: "/contents", icon: FileText, label: t("admin.contentManagement") },
    { path: "/questions", icon: MessageSquare, label: t("sidebar.directQuestions") },
    { path: "/notifications", icon: Bell, label: t("admin.notifications") },
    { path: "/faq", icon: HelpCircle, label: t("admin.faqManagement") },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div
          className="sidebar-logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            marginBottom: "2rem",
          }}
        >
          <img
            src={logoImg}
            alt="UO-Admin Home Logo"
            width="60"
            height="40"
            loading="eager"
            style={{ height: "40px", width: "60px", borderRadius: "8px" }}
          />
          <span
            className="sidebar-logo-text"
            style={{
              fontSize: "1.2rem",
              fontWeight: "700",
              whiteSpace: "nowrap",
            }}
          >
            UO-Admin
          </span>
        </div>

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
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="sidebar-action"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? t("common.aria.switchToLight") : t("common.aria.switchToDark")
            }
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === "dark" ? t("sidebar.lightMode") : t("sidebar.darkMode")}</span>
          </button>

          <button
            className="sidebar-action"
            onClick={toggleLang}
            aria-label={
              lang === "fr"
                ? t("common.aria.toEnglish")
                : t("common.aria.toFrench")
            }
          >
            <Globe size={18} />
            <span>{lang === "fr" ? "EN" : "FR"}</span>
          </button>

          <button
            className="sidebar-action sidebar-action--danger"
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            aria-label="Logout from administrator account"
          >
            <LogOut size={18} />
            <span>{t("sidebar.logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
