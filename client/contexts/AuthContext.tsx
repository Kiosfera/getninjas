import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  type: "client" | "professional";
  avatar?: string;
  verified: boolean;
  createdAt: string;
  location?: {
    city: string;
    state: string;
    coordinates?: [number, number];
  };
  // Professional specific fields
  profession?: string;
  categories?: string[];
  serviceRadius?: number;
  rating?: number;
  reviewCount?: number;
  // Client specific fields
  preferredPaymentMethod?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, code: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface SignupData {
  email: string;
  phone?: string;
  password: string;
  name: string;
  type: "client" | "professional";
  location?: {
    city: string;
    state: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const userData = await response.json();
    setUser(userData);
  };

  const loginWithPhone = async (phone: string, code: string) => {
    const response = await fetch("/api/auth/login-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });

    if (!response.ok) {
      throw new Error("Phone login failed");
    }

    const userData = await response.json();
    setUser(userData);
  };

  const signup = async (data: SignupData) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    const userData = await response.json();
    setUser(userData);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Profile update failed");
    }

    const updatedUser = await response.json();
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithPhone,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
