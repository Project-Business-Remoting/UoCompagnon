import { Eye, EyeOff, Globe, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";
import "./Login.css";

const PROGRAMS = [
  "B.Sc. Computer Science",
  "B.Sc. Software Engineering",
  "B.A. Economics",
  "B.A. Political Science",
  "B.Sc. Biology",
  "B.Sc. Mathematics",
  "B.Eng. Mechanical Engineering",
  "B.Eng. Civil Engineering",
  "B.Eng. Electrical Engineering",
  "B.A. Psychology",
  "B.A. Communication",
  "B.Com. Management",
  "LL.B. Common Law",
  "LL.B. Civil Law",
  "M.Sc. Computer Science",
  "M.A. Education",
  "MBA",
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    program: "",
    arrivalDate: "",
    classStartDate: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(
        lang === "fr"
          ? "Les mots de passe ne correspondent pas"
          : "Passwords do not match",
      );
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword: _confirmPassword, ...userData } = formData;
      await register(userData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Top bar */}
      <div className="auth-topbar">
        <button className="auth-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span>
            {theme === "dark" ? t("sidebar.lightMode") : t("sidebar.darkMode")}
          </span>
        </button>
        <button className="auth-toggle" onClick={toggleLang}>
          <Globe size={16} />
          <span>{lang === "fr" ? "EN" : "FR"}</span>
        </button>
      </div>

      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <img
            src={logoImg}
            alt="UO-Compagnon Logo"
            style={{ height: "120px", marginBottom: "0.5rem" }}
          />
        </div>

        {/* Form */}
        <div className="auth-card">
          <h2 className="auth-title">{t("register.title")}</h2>
          <p className="auth-description">{t("register.subtitle")}</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">{t("register.name")}</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder={t("register.namePlaceholder")}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("register.email")}</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder={t("register.emailPlaceholder")}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("register.program")}</label>
              <select
                name="program"
                className="form-input form-select"
                value={formData.program}
                onChange={handleChange}
                required
              >
                <option value="">{t("register.programPlaceholder")}</option>
                {PROGRAMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="auth-row">
              <div className="form-group">
                <label className="form-label">
                  {t("register.arrivalDate")}
                </label>
                <input
                  type="date"
                  name="arrivalDate"
                  className="form-input"
                  value={formData.arrivalDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  {t("register.classStartDate")}
                </label>
                <input
                  type="date"
                  name="classStartDate"
                  className="form-input"
                  value={formData.classStartDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-row">
              <div className="form-group">
                <label className="form-label">{t("register.password")}</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input"
                    style={{ paddingRight: "2.5rem" }}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  {t("register.confirmPassword")}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-input"
                    style={{ paddingRight: "2.5rem" }}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? "..." : t("register.submit")}
            </button>
          </form>

          <p className="auth-switch">
            {t("register.hasAccount")}{" "}
            <Link to="/login" className="auth-link">
              {t("register.login")}
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="auth-footer">{t("login.footer")}</p>
      </div>
    </div>
  );
};

export default Register;
