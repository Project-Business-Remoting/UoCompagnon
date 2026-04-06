import { Edit, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "../context/LangContext";
import { fetchProfile, updateProfile } from "../services/api";
import "./Profile.css";

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

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    program: "",
    arrivalDate: "",
    classStartDate: "",
  });
  const [saving, setSaving] = useState(false);

  const { lang, t } = useLang();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProfile();
        setProfile(data);
        if (data) {
          setEditForm({
            program: data.program || "",
            arrivalDate: data.arrivalDate ? data.arrivalDate.split('T')[0] : "",
            classStartDate: data.classStartDate ? data.classStartDate.split('T')[0] : "",
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedProfile = await updateProfile({
        program: editForm.program,
        arrivalDate: editForm.arrivalDate,
        classStartDate: editForm.classStartDate,
      });
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        program: profile.program || "",
        arrivalDate: profile.arrivalDate ? profile.arrivalDate.split('T')[0] : "",
        classStartDate: profile.classStartDate ? profile.classStartDate.split('T')[0] : "",
      });
    }
    setIsEditing(false);
  };

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ margin: 0 }}>{t("profile.title")}</h1>
        {!isEditing ? (
          <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
            <Edit size={16} /> Éditer
          </button>
        ) : (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-outline" onClick={handleCancel} disabled={saving} style={{ color: "var(--danger)" }}>
              <X size={16} /> Annuler
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              <Save size={16} /> {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        )}
      </div>

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
          {isEditing ? (
            <select
              name="program"
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-color)" }}
              value={editForm.program}
              onChange={handleEditChange}
            >
              {PROGRAMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          ) : (
            <p>{profile.program}</p>
          )}
        </div>
        <div className="card profile-info-card">
          <h3>{t("profile.arrivalDate")}</h3>
          {isEditing ? (
            <input
              type="date"
              name="arrivalDate"
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-color)" }}
              value={editForm.arrivalDate}
              onChange={handleEditChange}
            />
          ) : (
            <p>{formatDate(profile.arrivalDate)}</p>
          )}
        </div>
        <div className="card profile-info-card">
          <h3>{t("profile.classStartDate")}</h3>
          {isEditing ? (
            <input
              type="date"
              name="classStartDate"
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-color)" }}
              value={editForm.classStartDate}
              onChange={handleEditChange}
            />
          ) : (
            <p>{formatDate(profile.classStartDate)}</p>
          )}
        </div>
        <div className="card profile-info-card">
          <h3>{t("profile.currentPhase")}</h3>
          <p>{profile.currentStep || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
