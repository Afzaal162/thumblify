import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: { email: string; password: string }) => Promise<User>;
  signUp: (data: { name: string; email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_URL = "https://thumblify-server-44llwvl11-afzaal-hassans-projects.vercel.app";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/verify`, { withCredentials: true });
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const login = async (formData: { email: string; password: string }) => {
    await axios.post(`${BASE_URL}/api/auth/login`, formData, { withCredentials: true });
    const verifiedUser = await verifyUser();
    if (!verifiedUser) throw new Error("Login failed");
    return verifiedUser;
  };

  const signUp = async (formData: { name: string; email: string; password: string }) => {
    await axios.post(`${BASE_URL}/api/auth/register`, formData, { withCredentials: true });
    const verifiedUser = await verifyUser();
    if (!verifiedUser) throw new Error("Registration failed");
    return verifiedUser;
  };

  const logout = async () => {
    await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
