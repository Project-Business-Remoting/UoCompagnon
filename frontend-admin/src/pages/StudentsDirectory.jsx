import { useState, useEffect, useMemo } from 'react';
import { Search, Mail, BookOpen, Clock, Calendar } from 'lucide-react';
import { fetchAllStudents } from '../services/api';
import { useLang } from '../context/LangContext';
import './ContentManagement.css'; // On réutilise le style de liste

const PHASES = ["Toutes", "Before Arrival", "Welcome Week", "First Month", "Mid-Term"];

const StudentsDirectory = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('Tous');
  const [phaseFilter, setPhaseFilter] = useState('Toutes');
  
  // Modal pour détails
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { t } = useLang();

  useEffect(() => {
    loadStudents();
  }, []);

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
        <span className="badge badge-primary">{filteredStudents.length} {t('admin.totalStudents')}</span>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          {/* Barre d'outils de filtres */}
          <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder={t('admin.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 2.5rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)', 
                  background: 'var(--bg-color)', 
                  color: 'var(--text-color)' 
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('admin.program')} :</label>
              <select 
                value={programFilter} 
                onChange={(e) => setProgramFilter(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
              >
                {programsList.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('admin.phase')} :</label>
              <select 
                value={phaseFilter} 
                onChange={(e) => setPhaseFilter(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
              >
                {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="card admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.studentName')}</th>
                  <th>{t('admin.email')}</th>
                  <th>{t('admin.program')}</th>
                  <th>{t('admin.currentPhase')}</th>
                  <th>{t('admin.registrationDate')}</th>
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
                      <td className="font-semibold">{student.name}</td>
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
                      <td>{new Date(student.createdAt).toLocaleDateString('en-CA')}</td>
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
          <div className="modal-content card" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>{t('admin.studentProfile')}</h2>
              <button className="modal-close" aria-label="Close modal" onClick={() => setSelectedStudent(null)}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>&times;</span>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div 
                style={{ 
                  width: '64px', height: '64px', borderRadius: '50%', 
                  background: 'var(--primary)', color: 'white', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' 
                }}
              >
                {selectedStudent.name.charAt(0)}
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{selectedStudent.name}</h3>
              <a href={`mailto:${selectedStudent.email}`} style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} /> {selectedStudent.email}
              </a>
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
