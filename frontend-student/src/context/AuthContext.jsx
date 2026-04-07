import { createContext, useContext, useState } from "react";
import {
  loginUser as apiLogin,
  logoutUser as apiLogout,
  registerUser as apiRegister,
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("uo_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // If saved data doesn't include a token (from before auth migration), clear it
        if (parsed && parsed.token) return parsed;
        localStorage.removeItem("uo_user");
      }
    } catch (e) {
      localStorage.removeItem("uo_user");
    }
    return null;
  });
  const [loading] = useState(false);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    setUser(data);
    localStorage.setItem("uo_user", JSON.stringify(data));
    return data;
  };

  const register = async (userData) => {
    const data = await apiRegister(userData);
    setUser(data);
    localStorage.setItem("uo_user", JSON.stringify(data));
    return data;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("uo_user");
    try {
      await apiLogout();
    } catch (e) {
      console.error("Logout API failed", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
