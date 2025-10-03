'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  merchantId?: string;
  profileImage?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // For hardcoded auth, no need to verify token
          console.log('Auth initialized from localStorage');
        } catch (error) {
          console.error('Auth initialization error:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Hardcoded user data
      const hardcodedUsers = {
        'admin@beautify.com': {
          id: 'admin-123',
          email: 'admin@beautify.com',
          firstName: 'Jane',
          lastName: 'Admin',
          role: 'admin',
          isActive: true,
          merchantId: undefined,
          profileImage: undefined,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = hardcodedUsers[email as keyof typeof hardcodedUsers];
      
      if (!user) {
        toast.error('Invalid email or password');
        return false;
      }
      
      const token = `fake-token-${user.id}-${Date.now()}`;
      
      setToken(token);
      setUser(user);
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to login
    window.location.href = '/merchant/login';
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!user) {
        toast.error('No user data found');
        return false;
      }
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
      return true;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error('Profile update failed');
      return false;
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      // For hardcoded auth, just reload from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Profile refresh error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;