import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import './App.css';

// Pages — placeholder temporaires, remplacées dans les commits suivants
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '2rem' }}>
    <h1>{title}</h1>
    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Page en construction...</p>
  </div>
);

// Protection des routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PlaceholderPage title="Login" />} />
        <Route path="/register" element={<PlaceholderPage title="Register" />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<PlaceholderPage title="Dashboard" />} />
          <Route path="hub" element={<PlaceholderPage title="Hub" />} />
          <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
          <Route path="profile" element={<PlaceholderPage title="Profile" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
