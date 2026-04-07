import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Mail, BookOpen, Clock, Calendar, CheckCircle, XCircle, AlertCircle, ChevronDown, Check } from 'lucide-react';
import { fetchAllStudents, updateStudentPhotoStatus } from '../services/api';
import { useLang } from '../context/LangContext';
import { useSocketContext } from '../context/SocketContext';
import './ContentManagement.css'; 

const PHASES = ["Toutes", "Before Arrival", "Welcome Week", "First Month", "Mid-Term"];

const StudentsDirectory = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('Tous');
  const [phaseFilter, setPhaseFilter] = useState('Toutes');
  
  // Custom Dropdowns State
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [isPhaseOpen, setIsPhaseOpen] = useState(false);
  const programRef = useRef(null);
  const phaseRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (programRef.current && !programRef.current.contains(event.target)) setIsProgramOpen(false);
      if (phaseRef.current && !phaseRef.current.contains(event.target)) setIsPhaseOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Modal pour détails
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { socket } = useSocketContext();
  const { t } = useLang();

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handlePhotoUpdate = (data) => {
      console.log("[Socket.IO] Processing photo-status-updated:", data);
      
      setStudents(prev => prev.map(s => {
        if (String(s._id) === String(data.userId)) {
          console.log("[Socket.IO] Updating student in table:", s.name);
          return {
            ...s,
            profilePictureStatus: data.status,
            profilePicture: data.profilePicture || s.profilePicture 
          };
        }
        return s;
      }));

      // Update modal if open
      setSelectedStudent(prev => {
        if (prev && String(prev._id) === String(data.userId)) {
          console.log("[Socket.IO] Updating selected student in modal:", prev.name);
          return {
            ...prev,
            profilePictureStatus: data.status,
            profilePicture: data.profilePicture || prev.profilePicture
          };
        }
        return prev;
      });
    };

    socket.on("photo-status-updated", handlePhotoUpdate);

    return () => {
      socket.off("photo-status-updated", handlePhotoUpdate);
    };
  }, [socket]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await fetchAllStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdating(true);
      await updateStudentPhotoStatus(id, status);
      
      // Mettre à jour localement
      setStudents(prev => prev.map(s => s._id === id ? { ...s, profilePictureStatus: status } : s));
      if (selectedStudent?._id === id) {
        setSelectedStudent(prev => ({ ...prev, profilePictureStatus: status }));
      }
    } catch (err) {
      alert("Erreur: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'verified': return <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={10} /> Validée</span>;
      case 'rejected': return <span className="badge badge-error" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={10} /> Refusée</span>;
      default: return <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={10} /> Photo de profil à vérifier</span>;
    }
  };

  // Programmes dynamiques extraits des données étudiantes
  const programsList = useMemo(() => {
    const uniquePrograms = [...new Set(students.map(s => s.program).filter(Boolean))];
    uniquePrograms.sort();
    return ["Tous", ...uniquePrograms];
  }, [students]);

  // Filtrage
  const filteredStudents = students.filter(student => {
    const matchSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProgram = programFilter === 'Tous' || student.program === programFilter;
    const matchPhase = phaseFilter === 'Toutes' || student.currentStep === phaseFilter;
    
    return matchSearch && matchProgram && matchPhase;
  });

  if (loading) return <div className="loading-screen">{t('common.loading')}</div>;

  return (
    <div className="admin-contents">
      <div className="admin-header-row">
        <h1>{t('admin.studentsDirectory')}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge badge-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            {filteredStudents.length} {t('admin.totalStudents')}
          </span>
        </div>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          {/* Premium Filter Bar */}
          <div className="admin-filter-bar">
            <div className="admin-search-wrapper">
              <Search className="admin-search-icon" size={18} />
              <input
                type="text"
                className="admin-search-input"
                placeholder={t('admin.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="admin-dropdown-container" ref={programRef}>
              <div 
                className="admin-dropdown-trigger" 
                onClick={() => { setIsProgramOpen(!isProgramOpen); setIsPhaseOpen(false); }}
              >
                <span>{programFilter}</span>
                <ChevronDown size={16} style={{ transform: isProgramOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
              </div>
              {isProgramOpen && (
                <div className="admin-dropdown-menu">
                  {programsList.map(p => (
                    <div 
                      key={p} 
                      className={`admin-dropdown-item ${programFilter === p ? 'active' : ''}`}
                      onClick={() => { setProgramFilter(p); setIsProgramOpen(false); }}
                    >
                      {p}
                      {programFilter === p && <Check size={14} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-dropdown-container" ref={phaseRef}>
              <div 
                className="admin-dropdown-trigger" 
                onClick={() => { setIsPhaseOpen(!isPhaseOpen); setIsProgramOpen(false); }}
              >
                <span>{phaseFilter}</span>
                <ChevronDown size={16} style={{ transform: isPhaseOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
              </div>
              {isPhaseOpen && (
                <div className="admin-dropdown-menu">
                  {PHASES.map(p => (
                    <div 
                      key={p} 
                      className={`admin-dropdown-item ${phaseFilter === p ? 'active' : ''}`}
                      onClick={() => { setPhaseFilter(p); setIsPhaseOpen(false); }}
                    >
                      {p}
                      {phaseFilter === p && <Check size={14} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.studentName')}</th>
                  <th>Photo</th>
                  <th>{t('admin.email')}</th>
                  <th>{t('admin.program')}</th>
                  <th>{t('admin.currentPhase')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">{t('admin.noStudents')}</td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr 
                      key={student._id} 
                      onClick={() => setSelectedStudent(student)}
                      style={{ cursor: 'pointer' }}
                      className="admin-table-row-clickable"
                    >
                      <td className="font-semibold">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden',
                            background: 'var(--primary)', color: 'white', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem'
                          }}>
                            {student.profilePicture ? (
                              <img src={student.profilePicture} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              student.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          {student.name}
                        </div>
                      </td>
                      <td>
                        {student.profilePicture ? getStatusBadge(student.profilePictureStatus) : <span className="badge badge-outline">Aucune</span>}
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Mail size={14} color="var(--text-muted)" />
                          {student.email}
                        </span>
                      </td>
                      <td>{student.program}</td>
                      <td>
                        <span className="badge badge-primary">{student.currentStep}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal Détails Étudiant */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content card" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2>{t('admin.studentProfile')}</h2>
              <button className="modal-close" aria-label="Close modal" onClick={() => setSelectedStudent(null)}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>&times;</span>
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div 
                style={{ 
                  width: '96px', height: '96px', borderRadius: '50%', 
                  background: 'var(--primary)', color: 'white', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem',
                  overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {selectedStudent.profilePicture ? (
                  <img src={selectedStudent.profilePicture} alt={selectedStudent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  selectedStudent.name.charAt(0).toUpperCase()
                )}
              </div>
              
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem' }}>{selectedStudent.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{selectedStudent.email}</p>
              
              {selectedStudent.profilePicture && (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    {getStatusBadge(selectedStudent.profilePictureStatus)}
                  </div>
                  
                  {selectedStudent.profilePictureStatus === 'pending' ? (
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                      <button 
                        className="btn btn-outline" 
                        style={{ color: 'var(--danger)', borderColor: 'var(--danger)', flex: 1 }}
                        onClick={() => handleUpdateStatus(selectedStudent._id, 'rejected')}
                        disabled={updating}
                      >
                        Refuser
                      </button>
                      <button 
                        className="btn btn-primary" 
                        style={{ background: 'var(--success)', borderColor: 'var(--success)', flex: 1 }}
                        onClick={() => handleUpdateStatus(selectedStudent._id, 'verified')}
                        disabled={updating}
                      >
                        Valider
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-text" 
                      onClick={() => handleUpdateStatus(selectedStudent._id, 'pending')}
                      style={{ fontSize: '0.8rem' }}
                      disabled={updating}
                    >
                      Réinitialiser le statut
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
                <BookOpen size={20} color="var(--primary)" style={{ marginTop: '0.2rem' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{t('admin.academicProgram')}</div>
                  <div style={{ fontWeight: '500' }}>{selectedStudent.program}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
                <Clock size={20} color="var(--warning)" style={{ marginTop: '0.2rem' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{t('admin.currentPhase')}</div>
                  <span className="badge badge-warning">{selectedStudent.currentStep}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
                <Calendar size={20} color="var(--info)" style={{ marginTop: '0.2rem' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('admin.arrivalDate')}</span>
                    <span style={{ fontWeight: '500' }}>{new Date(selectedStudent.arrivalDate).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('admin.classesStart')}</span>
                    <span style={{ fontWeight: '500' }}>{new Date(selectedStudent.classStartDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsDirectory;
