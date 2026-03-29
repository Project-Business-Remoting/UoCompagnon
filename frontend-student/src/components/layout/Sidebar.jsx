import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Bell, User, Moon, Sun, Shield, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LangContext';
import './Sidebar.css';

const Sidebar = ({ notificationCount = 0, isOpen, onClose }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('sidebar.dashboard') },
    { path: '/hub', icon: BookOpen, label: t('sidebar.contents') },
    { path: '/notifications', icon: Bell, label: t('sidebar.notifications'), badge: notificationCount },
    { path: '/profile', icon: User, label: t('sidebar.profile') },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <span className="sidebar-logo-uo">UO</span>
          <span className="sidebar-logo-text">-Compagnon</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(({ path, icon: Icon, label, badge }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
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
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? t('sidebar.lightMode') : t('sidebar.darkMode')}</span>
          </button>

          <button className="sidebar-action" onClick={toggleLang}>
            <Globe size={18} />
            <span>{lang === 'fr' ? 'EN' : 'FR'}</span>
          </button>

          <button
            className="sidebar-action"
            onClick={() => window.location.href = 'http://localhost:5174'}
          >
            <Shield size={18} />
            <span>{t('sidebar.adminMode')}</span>
          </button>

          <button className="sidebar-action sidebar-action--danger" onClick={logout}>
            <LogOut size={18} />
            <span>{t('sidebar.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
