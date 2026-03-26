import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  about: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile;
  login: (identifier: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const defaultUser: UserProfile = {
  name: "Rehan Ahmed",
  phone: "+92 300 1234567",
  email: "rehan@ghupshup.app",
  avatar: "",
  about: "Hey there! I'm using GhupShup ✨",
};

const VALID_CREDENTIALS = [
  { identifier: "rehan", password: "ghupshup123" },
  { identifier: "rehan@ghupshup.app", password: "ghupshup123" },
  { identifier: "+923001234567", password: "ghupshup123" },
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("gs_auth") === "true";
  });
  const [user, setUser] = useState<UserProfile>(() => {
    const stored = localStorage.getItem("gs_user");
    return stored ? JSON.parse(stored) : defaultUser;
  });

  useEffect(() => {
    localStorage.setItem("gs_auth", String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("gs_user", JSON.stringify(user));
  }, [user]);

  const login = useCallback((identifier: string, password: string) => {
    if (!identifier.trim() || !password.trim()) {
      return { success: false, error: "Please fill in all fields" };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }
    const match = VALID_CREDENTIALS.find(
      (c) => c.identifier.toLowerCase() === identifier.toLowerCase() && c.password === password
    );
    if (!match) {
      return { success: false, error: "Invalid credentials. Try: rehan / ghupshup123" };
    }
    setIsAuthenticated(true);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem("gs_auth");
    localStorage.removeItem("gs_user");
    setUser(defaultUser);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
