import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin credentials
  const ADMIN_EMAIL = "admin@catrink.in";
  const ADMIN_PASSWORD = "HardikSri@123";

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    // Check if it's admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // For admin, we'll create a mock user session
      setIsAdmin(true);
      const mockAdmin = {
        uid: "admin-uid",
        email: ADMIN_EMAIL,
        displayName: "Admin",
      } as User;
      setCurrentUser(mockAdmin);
      return Promise.resolve({ user: mockAdmin });
    } else {
      // Regular Firebase authentication
      setIsAdmin(false);
      return signInWithEmailAndPassword(auth, email, password);
    }
  };

  const logout = async () => {
    setIsAdmin(false);
    setCurrentUser(null);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email !== ADMIN_EMAIL) {
        setCurrentUser(user);
        setIsAdmin(false);
      } else if (!user && !isAdmin) {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isAdmin]);

  const value: AuthContextType = {
    currentUser,
    login,
    signup,
    logout,
    loading,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
