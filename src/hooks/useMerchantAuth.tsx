'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized) {
      console.log('🔧 MerchantAuth: Already initialized, skipping...');
      return;
    }

    const initializeMerchantAuth = async () => {
      console.log('🔧 MerchantAuth: Starting initialization...');
      
      try {
        const storedToken = localStorage.getItem('merchantAuthToken');
        const storedUser = localStorage.getItem('merchantUser');
        const rememberMe = localStorage.getItem('merchantRememberMe') === 'true';

        console.log('🔧 MerchantAuth: Found stored data:', { 
          hasToken: !!storedToken, 
          hasUser: !!storedUser, 
          rememberMe 
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
            
            // Update all auth state synchronously in batch
            setToken(storedToken);
            setUser(parsedUser);
            setApplication(merchantApplication as MerchantApplication);
            
            console.log('✅ MerchantAuth: Successfully restored auth state from localStorage');
          } catch (error) {
            console.error('❌ MerchantAuth: Error parsing stored user data:', error);
            // Clear corrupted data
            localStorage.removeItem('merchantAuthToken');
            localStorage.removeItem('merchantUser');
            localStorage.removeItem('merchantRememberMe');
            localStorage.removeItem('merchantAuthExpiration');
          }
        } else {
          console.log('📝 MerchantAuth: No stored authentication found');
        }
      } catch (error) {
        console.error('❌ MerchantAuth: Initialization error:', error);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
        console.log('🏁 MerchantAuth: Initialization complete');
      }
    };

    initializeMerchantAuth();
  }, [isInitialized]);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
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
  };

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

  const logout = () => {
    console.log('🚪 MerchantAuth: Logging out...');
    
    // Clear state first
    setUser(null);
    setApplication(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('merchantAuthToken');
    localStorage.removeItem('merchantUser');
    localStorage.removeItem('merchantRememberMe');
    localStorage.removeItem('merchantAuthExpiration');
    
    console.log('✅ MerchantAuth: Logout complete, state and localStorage cleared');
    toast.success('Logged out successfully');
    router.push('/merchant/login');
  };

  const value: MerchantAuthContextType = {
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
  };

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