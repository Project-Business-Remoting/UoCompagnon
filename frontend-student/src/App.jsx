import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JourneyHub from './pages/JourneyHub';
import ContentDetail from './pages/ContentDetail';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Faq from './pages/Faq';
import DirectQuestions from './pages/DirectQuestions';
import AnonymousQuestions from './pages/AnonymousQuestions';
import Welcome from './pages/Welcome';
import './App.css';// Protection des routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Chargement...</div>;
  if (!user) return <Navigate to="/welcome" />;
  return children;
};

// Redirection si déjà connecté
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Chargement...</div>;
  if (user) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={
          <PublicRoute><Welcome /></PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><Register /></PublicRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hub" element={<JourneyHub />} />
          <Route path="hub/:id" element={<ContentDetail />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="faq" element={<Faq />} />
          <Route path="direct-questions" element={<DirectQuestions />} />
          <Route path="anonymous-questions" element={<AnonymousQuestions />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
