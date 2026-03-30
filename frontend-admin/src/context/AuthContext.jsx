import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('uo_admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('uo_admin_user');
    if (savedUser && token) {
      const parsed = JSON.parse(savedUser);
      if (parsed.role === 'admin') {
        setUser(parsed);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    if (data.role !== 'admin') {
      throw new Error('Ce compte n\'a pas les droits administrateur');
    }
    setUser(data);
    setToken(data.token);
    localStorage.setItem('uo_admin_token', data.token);
    localStorage.setItem('uo_admin_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('uo_admin_token');
    localStorage.removeItem('uo_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
