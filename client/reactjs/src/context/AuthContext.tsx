import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// Axios instance pointing to your live backend
const api = axios.create({
  baseURL: "https://thumblify-server-smoky.vercel.app",
  withCredentials: true // crucial for session cookies
});

interface AuthContextType {
  user: any | null;
  login: (data: { email: string; password: string }) => Promise<any>;
  signUp: (data: { name: string; email: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true); // to track initial verification

  // Verify user on initial load
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await api.get("/api/auth/verify");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  // Login function
  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      setUser(res.data.user);
      return res.data.user;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  // Sign up function
  const signUp = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    try {
      const res = await api.post("/api/auth/register", { name, email, password });
      setUser(res.data.user);
      return res.data.user;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
    } catch (err: any) {
      console.error("Logout failed", err);
    }
  };

  // Optional: prevent rendering children until verification is done
  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
