import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Protection des routes admin
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Chargement...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;
  return children;
};

// Redirection si déjà connecté
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Chargement...</div>;
  if (user && user.role === 'admin') return <Navigate to="/dashboard" />;
  return children;
};

// Placeholder pour le commit 8
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '2rem' }}>
    <h1>{title}</h1>
    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Page en construction pour le commit suivant...</p>
  </div>
);

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute><AdminLogin /></PublicRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="contents" element={<PlaceholderPage title="Gestion des Contenus" />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
