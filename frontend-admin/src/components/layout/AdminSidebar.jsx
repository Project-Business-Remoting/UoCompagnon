import {
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  Sun,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import "./AdminSidebar.css";

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/contents", icon: FileText, label: "Content Management" },
    { path: "/questions", icon: MessageSquare, label: "Questions Mgt" },
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
            UO-Admin
          </span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ path, icon: Icon, label }) => (
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
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-action" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
          <button
            className="sidebar-action sidebar-action--danger"
            onClick={() => {
              logout();
              window.location.href = "http://localhost:5173/welcome";
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
