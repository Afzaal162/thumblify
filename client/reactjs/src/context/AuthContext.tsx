import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

// Axios instance with credentials
const api = axios.create({
  baseURL: "https://thumblify-server-44llwvl11-afzaal-hassans-projects.vercel.app",
  withCredentials: true // ⚠️ critical for cookies
});

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  login: (data: { email: string; password: string }) => Promise<any>;
  signUp: (data: { name: string; email: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const login = async ({ email, password }: { email: string; password: string }) => {
    const res = await api.post("/api/auth/login", { email, password });
    setUser(res.data.user); // store user info in context
    return res.data.user;
  };

  const signUp = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const res = await api.post("/api/auth/register", { name, email, password });
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
