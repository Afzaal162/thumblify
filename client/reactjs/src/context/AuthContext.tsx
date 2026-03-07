import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../configs/api";
import type { IUser } from "../assets/assets";

interface AuthContextProvider {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  login: (data: { email: string; password: string }) => Promise<void>;
  signUp: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProvider>({} as AuthContextProvider);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setUser(data.user);
      setIsLoggedIn(true);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const signUp = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password });
      setUser(data.user);
      setIsLoggedIn(true);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Sign up failed");
    }
  };

  const logout = async () => {
    try {
      const { data } = await api.post("/api/auth/logout");
      setUser(null);
      setIsLoggedIn(false);
      toast.success(data.message);
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/api/auth/verify");
      setUser(data.user);
      setIsLoggedIn(true);
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ HMR-safe named export
export const useAuth = () => useContext(AuthContext);