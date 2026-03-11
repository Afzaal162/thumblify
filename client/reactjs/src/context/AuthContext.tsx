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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verify session on app load
  const verifyUser = async () => {
    try {
      const res = await axios.get("/api/auth/verify", { withCredentials: true });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const login = async (formData: { email: string; password: string }) => {
    await axios.post("/api/auth/login", formData, { withCredentials: true });
    return verifyUser().then(() => user!); // ensure user is updated
  };

  const signUp = async (formData: { name: string; email: string; password: string }) => {
    await axios.post("/api/auth/register", formData, { withCredentials: true });
    return verifyUser().then(() => user!);
  };

  const logout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
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
