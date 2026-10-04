import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

type AuthContextType = {
  isAuthenticated: boolean | null;
  isProfiled: boolean | null;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isProfiled, setIsProfiled] = useState<boolean | null>(null);

  const refreshAuth = async () => {
    try {
      setIsAuthenticated(null);
      setIsProfiled(null);

      const res = await api.get("/auth/me");
      const user = res.data.user;

      if (!user) {
        setIsAuthenticated(false);
        setIsProfiled(false);
        return;
      }

      setIsAuthenticated(true);

      try {
        const profileRes = await api.get("/profile");
        setIsProfiled(profileRes.data.success === true);
      } catch {
        setIsProfiled(false);
      }
    } catch {
      setIsAuthenticated(false);
      setIsProfiled(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isProfiled, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};