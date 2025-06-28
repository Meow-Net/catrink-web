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
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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

  // Load session from localStorage on app start
  useEffect(() => {
    const savedSession = localStorage.getItem("catrink_session");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.email === ADMIN_EMAIL) {
          setIsAdmin(true);
          const mockAdmin = {
            uid: "admin-uid",
            email: ADMIN_EMAIL,
            displayName: "Admin",
          } as User;
          setCurrentUser(mockAdmin);
        } else {
          // For regular users, restore from saved session
          setCurrentUser(session);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error loading session:", error);
        localStorage.removeItem("catrink_session");
      }
    }
    setLoading(false);
  }, []);

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

      // Save admin session to localStorage
      localStorage.setItem(
        "catrink_session",
        JSON.stringify({
          uid: mockAdmin.uid,
          email: mockAdmin.email,
          displayName: mockAdmin.displayName,
          isAdmin: true,
        }),
      );

      return Promise.resolve({ user: mockAdmin });
    } else {
      // Regular Firebase authentication
      setIsAdmin(false);
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Save user session to localStorage
      if (result.user) {
        localStorage.setItem(
          "catrink_session",
          JSON.stringify({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            isAdmin: false,
          }),
        );
      }

      return result;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setIsAdmin(false);
    // Clear localStorage session
    localStorage.removeItem("catrink_session");
  };

  const resetPassword = async (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    loading,
    isAdmin,
  };
        // Save new Firebase user session
        localStorage.setItem(
          "catrink_session",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            isAdmin: false,
          }),
        );
      } else if (!user && !isAdmin && !savedSession) {
        setCurrentUser(null);
        setIsAdmin(false);
      }

      if (!savedSession) {
        setLoading(false);
      }
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