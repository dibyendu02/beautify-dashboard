'use client';

import { useState, useEffect, useContext, createContext, ReactNode, useMemo, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Singleton auth state manager for persistence across component re-mounts
class MerchantAuthStateManager {
  private static instance: MerchantAuthStateManager;
  private authState: {
    user: any | null;
    application: any | null;
    token: string | null;
    isInitialized: boolean;
  } = {
    user: null,
    application: null,
    token: null,
    isInitialized: false,
  };

  private constructor() {}

  static getInstance(): MerchantAuthStateManager {
    if (!MerchantAuthStateManager.instance) {
      MerchantAuthStateManager.instance = new MerchantAuthStateManager();
    }
    return MerchantAuthStateManager.instance;
  }

  getState() {
    return { ...this.authState };
  }

  setState(newState: Partial<typeof this.authState>) {
    this.authState = { ...this.authState, ...newState };
    console.log('🔄 AuthStateManager: State updated', this.authState);
  }

  clearState() {
    this.authState = {
      user: null,
      application: null,
      token: null,
      isInitialized: false,
    };
    console.log('🗑️ AuthStateManager: State cleared');
  }

  hasValidState(): boolean {
    return !!(this.authState.user && this.authState.token && this.authState.isInitialized);
  }
}

const authStateManager = MerchantAuthStateManager.getInstance();

interface MerchantApplication {
  id: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'incomplete';
  businessName: string;
  businessType: 'salon' | 'spa' | 'freelancer' | 'clinic' | 'other';
  businessEmail: string;
  applicationDate: string;
  verificationSteps: {
    businessEmailVerified: boolean;
    documentsUploaded: boolean;
    bankDetailsProvided: boolean;
    backgroundCheckPassed: boolean;
  };
}

interface MerchantUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  merchantId?: string;
  profileImage?: string;
  createdAt: string;
}

interface MerchantAuthContextType {
  user: MerchantUser | null;
  application: MerchantApplication | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMerchantVerified: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  register: (merchantData: any) => Promise<boolean>;
  applyForMerchantStatus: (applicationData: any) => Promise<boolean>;
  refreshStatus: () => Promise<void>;
  updateApplication: (applicationData: any) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
}

const MerchantAuthContext = createContext<MerchantAuthContextType | undefined>(undefined);

export const MerchantAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MerchantUser | null>(null);
  const [application, setApplication] = useState<MerchantApplication | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const initializationAttempted = useRef(false);
  const hmrCounter = useRef(0);
  const lastAuthCheck = useRef(0);
  const router = useRouter();

  // Hydration effect - runs once on mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // HMR detection and state preservation
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Increment HMR counter
      hmrCounter.current += 1;
      
      // If this is not the first mount, we're likely in HMR
      if (hmrCounter.current > 1) {
        console.log('🔄 MerchantAuth: HMR detected, preserving auth state...');
        
        // Force immediate state restoration from localStorage
        const storedToken = localStorage.getItem('merchantAuthToken');
        const storedUser = localStorage.getItem('merchantUser');
        
        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            const merchantApplication = {
              id: 'app-123',
              status: 'approved',
              businessName: 'John\'s Beauty Salon',
              businessType: 'salon',
              businessEmail: 'merchant@beautify.com',
              applicationDate: '2024-01-01T00:00:00.000Z',
              verificationSteps: {
                businessEmailVerified: true,
                documentsUploaded: true,
                bankDetailsProvided: true,
                backgroundCheckPassed: true,
              },
            };
            
            // Immediately restore state without waiting for normal initialization
            setToken(storedToken);
            setUser(parsedUser);
            setApplication(merchantApplication as MerchantApplication);
            setIsInitialized(true);
            setIsLoading(false);
            
            console.log('✅ MerchantAuth: HMR state restoration complete');
          } catch (error) {
            console.error('❌ MerchantAuth: HMR state restoration failed:', error);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    // Prevent multiple initializations and wait for hydration
    if (initializationAttempted.current || !isHydrated) {
      return;
    }
    
    // StrictMode-safe initialization with timing check
    const now = Date.now();
    if (now - lastAuthCheck.current < 100) {
      console.log('🔧 MerchantAuth: Skipping duplicate initialization (StrictMode)');
      return;
    }
    lastAuthCheck.current = now;

    const initializeMerchantAuth = () => {
      console.log('🔧 MerchantAuth: Starting initialization...');
      initializationAttempted.current = true;
      
      try {
        // First check singleton state
        const singletonState = authStateManager.getState();
        if (authStateManager.hasValidState()) {
          console.log('🔄 MerchantAuth: Restoring from singleton state');
          setToken(singletonState.token);
          setUser(singletonState.user);
          setApplication(singletonState.application);
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }
        
        const storedToken = localStorage.getItem('merchantAuthToken');
        const storedUser = localStorage.getItem('merchantUser');

        console.log('🔧 MerchantAuth: Found stored data:', { 
          hasToken: !!storedToken, 
          hasUser: !!storedUser
        });

        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            
            // Set hardcoded approved application for merchant
            const merchantApplication = {
              id: 'app-123',
              status: 'approved',
              businessName: 'John\'s Beauty Salon',
              businessType: 'salon',
              businessEmail: 'merchant@beautify.com',
              applicationDate: '2024-01-01T00:00:00.000Z',
              verificationSteps: {
                businessEmailVerified: true,
                documentsUploaded: true,
                bankDetailsProvided: true,
                backgroundCheckPassed: true,
              },
            };
            
            // Update singleton state
            authStateManager.setState({
              token: storedToken,
              user: parsedUser,
              application: merchantApplication,
              isInitialized: true,
            });
            
            // Update all auth state synchronously in batch - IMMEDIATELY
            setToken(storedToken);
            setUser(parsedUser);
            setApplication(merchantApplication as MerchantApplication);
            setIsInitialized(true);
            setIsLoading(false);
            
            console.log('✅ MerchantAuth: Successfully restored auth state from localStorage');
          } catch (error) {
            console.error('❌ MerchantAuth: Error parsing stored user data:', error);
            // Clear corrupted data
            authStateManager.clearState();
            localStorage.removeItem('merchantAuthToken');
            localStorage.removeItem('merchantUser');
            localStorage.removeItem('merchantRememberMe');
            localStorage.removeItem('merchantAuthExpiration');
            setIsInitialized(true);
            setIsLoading(false);
          }
        } else {
          console.log('📝 MerchantAuth: No stored authentication found');
          authStateManager.clearState();
          setIsInitialized(true);
          setIsLoading(false);
        }
        
        console.log('🏁 MerchantAuth: Initialization complete');
      } catch (error) {
        console.error('❌ MerchantAuth: Initialization error:', error);
        authStateManager.clearState();
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    // Execute immediately without timeout to prevent state loss during navigation
    initializeMerchantAuth();
  }, [isHydrated]);

  // localStorage polling for immediate state availability
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') {
      return;
    }

    let pollInterval: NodeJS.Timeout;
    
    const pollStorageState = () => {
      const currentToken = localStorage.getItem('merchantAuthToken');
      const currentUser = localStorage.getItem('merchantUser');
      
      // If we have stored auth but no current state, restore immediately
      if (currentToken && currentUser && !token && !user) {
        try {
          const parsedUser = JSON.parse(currentUser);
          const merchantApplication = {
            id: 'app-123',
            status: 'approved',
            businessName: 'John\'s Beauty Salon',
            businessType: 'salon',
            businessEmail: 'merchant@beautify.com',
            applicationDate: '2024-01-01T00:00:00.000Z',
            verificationSteps: {
              businessEmailVerified: true,
              documentsUploaded: true,
              bankDetailsProvided: true,
              backgroundCheckPassed: true,
            },
          };
          
          console.log('📡 MerchantAuth: Polling detected auth state, restoring...');
          setToken(currentToken);
          setUser(parsedUser);
          setApplication(merchantApplication as MerchantApplication);
          setIsInitialized(true);
          setIsLoading(false);
        } catch (error) {
          console.error('❌ MerchantAuth: Polling restoration failed:', error);
        }
      }
      
      // If localStorage is cleared but we have state, clear state
      if ((!currentToken || !currentUser) && (token || user)) {
        console.log('📡 MerchantAuth: Polling detected auth cleared, clearing state...');
        setToken(null);
        setUser(null);
        setApplication(null);
        setIsInitialized(false);
      }
    };
    
    // Poll every 100ms for immediate responsiveness
    pollInterval = setInterval(pollStorageState, 100);
    
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [isHydrated, token, user]);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('🔐 Starting merchant login process...', { email, rememberMe });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Hardcoded merchant authentication
      if (email === 'merchant@beautify.com') {
        const newUser: MerchantUser = {
          id: 'merchant-123',
          email: 'merchant@beautify.com',
          firstName: 'John',
          lastName: 'Merchant',
          role: 'merchant',
          isActive: true,
          isVerified: true,
          merchantId: 'merchant-123',
          profileImage: undefined,
          createdAt: '2024-01-01T00:00:00.000Z',
        };
        
        const merchantApplication: MerchantApplication = {
          id: 'app-123',
          status: 'approved',
          businessName: 'John\'s Beauty Salon',
          businessType: 'salon',
          businessEmail: 'merchant@beautify.com',
          applicationDate: '2024-01-01T00:00:00.000Z',
          verificationSteps: {
            businessEmailVerified: true,
            documentsUploaded: true,
            bankDetailsProvided: true,
            backgroundCheckPassed: true,
          },
        };
        
        const newToken = `fake-merchant-token-${newUser.id}-${Date.now()}`;
        console.log('✅ Login successful, updating state...', { user: newUser, application: merchantApplication });
        
        // Set expiration for remember me functionality BEFORE storing
        if (rememberMe) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30); // 30 days
          localStorage.setItem('merchantAuthExpiration', expirationDate.toISOString());
        } else {
          // Session only - expire when browser closes
          localStorage.removeItem('merchantAuthExpiration');
        }
        
        // Store auth data FIRST before updating state
        localStorage.setItem('merchantAuthToken', newToken);
        localStorage.setItem('merchantUser', JSON.stringify(newUser));
        localStorage.setItem('merchantRememberMe', rememberMe.toString());
        console.log('💾 Auth data stored in localStorage');
        
        // Update singleton state
        authStateManager.setState({
          token: newToken,
          user: newUser,
          application: merchantApplication,
          isInitialized: true,
        });
        
        // Update state in batch to prevent flickers
        setToken(newToken);
        setUser(newUser);
        setApplication(merchantApplication);
        
        toast.success('Login successful!');
        console.log('🎉 Login completed successfully, state updated, returning true');
        return true;
      } else {
        console.log('❌ Login failed - invalid credentials');
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error: any) {
      console.error('❌ Merchant login error:', error);
      toast.error('Login failed');
      return false;
    } finally {
      setIsLoading(false);
      console.log('🔄 Login process completed, loading state reset');
    }
  }, [router]);

  const register = async (merchantData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For hardcoded implementation, reject registration
      toast.error('Registration not available in demo mode');
      return false;
    } catch (error: any) {
      console.error('Merchant registration error:', error);
      toast.error('Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const applyForMerchantStatus = async (applicationData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For hardcoded implementation, reject application
      toast.error('Application submission not available in demo mode');
      return false;
    } catch (error: any) {
      console.error('Merchant application error:', error);
      toast.error('Application submission failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplication = async (applicationData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For hardcoded implementation, just show success
      toast.success('Application updated successfully!');
      return true;
    } catch (error: any) {
      console.error('Application update error:', error);
      toast.error('Application update failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = async (): Promise<void> => {
    try {
      // For hardcoded implementation, no need to refresh
      console.log('Status refresh - using hardcoded data');
    } catch (error) {
      console.error('Status refresh error:', error);
    }
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (email === 'merchant@beautify.com') {
        toast.success('Password reset link sent to your email!');
        return true;
      } else {
        toast.error('Email not found');
        return false;
      }
    } catch (error: any) {
      console.error('Password reset request error:', error);
      toast.error('Password reset request failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Password reset successful!');
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('Password reset failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    console.log('🚪 MerchantAuth: Logging out...');
    
    // Clear singleton state first
    authStateManager.clearState();
    
    // Clear React state
    setUser(null);
    setApplication(null);
    setToken(null);
    setIsInitialized(false);
    setIsLoading(false);
    
    // Reset initialization flag
    initializationAttempted.current = false;
    
    // Clear localStorage
    localStorage.removeItem('merchantAuthToken');
    localStorage.removeItem('merchantUser');
    localStorage.removeItem('merchantRememberMe');
    localStorage.removeItem('merchantAuthExpiration');
    
    console.log('✅ MerchantAuth: Logout complete, state and localStorage cleared');
    toast.success('Logged out successfully');
    router.push('/merchant/login');
  }, [router]);

  const value: MerchantAuthContextType = useMemo(() => ({
    user,
    application,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    isMerchantVerified: !!user?.isVerified && !!application && application.status === 'approved',
    login,
    logout,
    register,
    applyForMerchantStatus,
    refreshStatus,
    updateApplication,
    requestPasswordReset,
    resetPassword,
  }), [user, application, token, isLoading, login, logout]);

  return (
    <MerchantAuthContext.Provider value={value}>
      {children}
    </MerchantAuthContext.Provider>
  );
};

export const useMerchantAuth = (): MerchantAuthContextType => {
  const context = useContext(MerchantAuthContext);
  if (context === undefined) {
    throw new Error('useMerchantAuth must be used within a MerchantAuthProvider');
  }
  return context;
};

export default useMerchantAuth;