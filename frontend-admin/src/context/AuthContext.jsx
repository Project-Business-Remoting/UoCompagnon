import { createContext, useContext, useState } from "react";
import {
  loginUser as apiLogin,
  logoutAdmin as apiLogout,
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("uo_admin_user");
      if (!savedUser) return null;

      const parsed = JSON.parse(savedUser);
      if (!parsed || parsed.role !== "admin" || !parsed.token) {
        localStorage.removeItem("uo_admin_user");
        return null;
      }

      return parsed;
    } catch (e) {
      localStorage.removeItem("uo_admin_user");
      return null;
    }
  });
  const [loading] = useState(false);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    if (data.role !== "admin") {
      throw new Error("Ce compte n'a pas les droits administrateur");
    }
    setUser(data);
    localStorage.setItem("uo_admin_user", JSON.stringify(data));
    return data;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("uo_admin_user");
    try {
      await apiLogout();
    } catch (e) {
      console.error("Logout admin failed", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
