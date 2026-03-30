import { Globe, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";
import { fetchProfile } from "../services/api";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProfile();
        setProfile(data);
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
  if (!profile) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString(
      lang === "fr" ? "fr-CA" : "en-CA",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  return (
    <div className="profile">
      <h1>{t("profile.title")}</h1>

      {/* Avatar + Name */}
      <div className="card profile-header">
        <div className="profile-avatar">
          {profile.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-identity">
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-email">{profile.email}</p>
        </div>
        {profile.currentStep && (
          <span className="badge badge-primary">{profile.currentStep}</span>
        )}
      </div>

      {/* Info Grid */}
      <div className="profile-grid">
        <div className="card profile-info-card">
          <h3>{t("profile.program")}</h3>
          <p>{profile.program}</p>
        </div>
        <div className="card profile-info-card">
          <h3>{t("profile.arrivalDate")}</h3>
          <p>{formatDate(profile.arrivalDate)}</p>
        </div>
        <div className="card profile-info-card">
          <h3>{t("profile.classStartDate")}</h3>
          <p>{formatDate(profile.classStartDate)}</p>
        </div>
        <div className="card profile-info-card">
          <h3>{t("profile.currentPhase")}</h3>
          <p>{profile.currentStep || "-"}</p>
        </div>
      </div>

      {/* Preferences */}
      <div className="card profile-prefs">
        <h2>{t("profile.preferences")}</h2>
        <div className="profile-prefs-list">
          <div className="profile-pref-item" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <div>
              <span className="profile-pref-label">
                {theme === "dark"
                  ? t("sidebar.lightMode")
                  : t("sidebar.darkMode")}
              </span>
              <span className="profile-pref-value">
                {theme === "dark" ? "Dark" : "Light"}
              </span>
            </div>
          </div>
          <div className="profile-pref-item" onClick={toggleLang}>
            <Globe size={20} />
            <div>
              <span className="profile-pref-label">Langue / Language</span>
              <span className="profile-pref-value">
                {lang === "fr" ? "Francais" : "English"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
