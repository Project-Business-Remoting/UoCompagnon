import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LangProvider } from './context/LangContext';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/layout/Layout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ContentManagement from './pages/ContentManagement';
import QuestionsManagement from './pages/QuestionsManagement';
import NotificationManagement from './pages/NotificationManagement';
import StudentsDirectory from './pages/StudentsDirectory';
import FaqManagement from './pages/FaqManagement';
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
          <Route path="students" element={<StudentsDirectory />} />
          <Route path="contents" element={<ContentManagement />} />
          <Route path="questions" element={<QuestionsManagement />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route path="faq" element={<FaqManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <SocketProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </SocketProvider>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;
