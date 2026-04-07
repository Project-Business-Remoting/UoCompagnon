import { Edit, Save, X, Camera, CheckCircle, XCircle, Clock } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
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
  const { photoUpdateTrigger } = useOutletContext() || {};
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const { lang, t } = useLang();

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

  useEffect(() => {
    load();
  }, [photoUpdateTrigger]);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image valide.");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");
      
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch('/api/users/profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur lors de l'upload");
      }

      const result = await response.json();
      setProfile(prev => ({ 
        ...prev, 
        profilePicture: result.profilePicture,
        profilePictureStatus: "pending" 
      }));
      
    } catch (err) {
      setError("Erreur lors de l'upload de l'image: " + err.message);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  const renderStatusBadge = () => {
    if (!profile.profilePicture) return null;
    
    switch (profile.profilePictureStatus) {
      case "verified":
        return <span className="photo-badge success"><CheckCircle size={14} /> Photo validée</span>;
      case "rejected":
        return <span className="photo-badge danger"><XCircle size={14} /> Photo refusée</span>;
      default:
        return <span className="photo-badge warning"><Clock size={14} /> Photo en cours de vérification</span>;
    }
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

      <div className="card profile-header">
        <div className="avatar-section">
          <div 
            className="profile-avatar-container"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadingImage ? (
              <div className="avatar-loading">
                <div className="spinner-small"></div>
              </div>
            ) : profile.profilePicture ? (
              <img src={profile.profilePicture} alt="Profile" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                {profile.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="avatar-overlay">
              <Camera size={24} color="white" />
              <span>Changer</span>
            </div>
          </div>
          <button 
            className="btn-text btn-photo" 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
          >
            {uploadingImage ? "Envoi..." : "Modifier la photo"}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleImageUpload}
          />
        </div>
        
        <div className="profile-identity">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h2 className="profile-name" style={{ margin: 0 }}>{profile.name}</h2>
            {renderStatusBadge()}
          </div>
          <p className="profile-email">{profile.email}</p>
        </div>
        {profile.currentStep && (
          <span className="badge badge-primary">{profile.currentStep}</span>
        )}
      </div>

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
