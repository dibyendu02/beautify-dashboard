import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Hardcoded user data
const hardcodedUsers = {
  'merchant@beautify.com': {
    id: 'merchant-123',
    email: 'merchant@beautify.com',
    firstName: 'John',
    lastName: 'Merchant',
    phone: '+1234567890',
    role: 'merchant' as const,
    avatar: undefined,
    isActive: true,
    isVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  'admin@beautify.com': {
    id: 'admin-123',
    email: 'admin@beautify.com',
    firstName: 'Jane',
    lastName: 'Admin',
    phone: '+1234567891',
    role: 'admin' as const,
    avatar: undefined,
    isActive: true,
    isVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
};

// Hardcoded authentication thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = hardcodedUsers[email as keyof typeof hardcodedUsers];
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = `fake-token-${user.id}-${Date.now()}`;
    const response = {
      success: true,
      user,
      token,
      message: 'Login successful'
    };
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
  }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For hardcoded implementation, just reject registration
    throw new Error('Registration not available in demo mode');
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      throw new Error('No authentication data found');
    }
    
    return {
      success: true,
      user: JSON.parse(user)
    };
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      throw new Error('No user data found');
    }
    
    const updatedUser = { ...JSON.parse(currentUser), ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return {
      success: true,
      user: updatedUser
    };
  }
);

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
      };
    }
    
    throw new Error('No user data found');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Get Profile
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      // Load from storage
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;