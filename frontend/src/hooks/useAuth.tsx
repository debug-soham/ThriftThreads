import { useState, useEffect, createContext, useContext } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface Session {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            const userData: User = {
              id: data.user._id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              user_metadata: { full_name: data.user.name }
            };

            setUser(userData);
            setSession({
              user: userData,
              access_token: token
            });
            setIsAdmin(data.user.role === 'admin');
          } else {
            localStorage.removeItem('auth_token');
          }
        } catch (e) {
          console.error('Auth initialization error:', e);
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name: fullName })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.error || 'Sign up failed') };
      }

      const userData: User = {
        id: data.user._id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        user_metadata: { full_name: data.user.name }
      };

      const newSession: Session = {
        user: userData,
        access_token: data.token
      };

      setSession(newSession);
      setUser(userData);
      setIsAdmin(data.user.role === 'admin');
      localStorage.setItem('auth_token', data.token);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.error || 'Sign in failed') };
      }

      const userData: User = {
        id: data.user._id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        user_metadata: { full_name: data.user.name }
      };

      const newSession: Session = {
        user: userData,
        access_token: data.token
      };

      setSession(newSession);
      setUser(userData);
      setIsAdmin(data.user.role === 'admin');
      localStorage.setItem('auth_token', data.token);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
