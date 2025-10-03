import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Check for merchant token first, then fall back to regular auth token
    const merchantToken = localStorage.getItem('merchantAuthToken');
    const regularToken = localStorage.getItem('authToken');
    const token = merchantToken || regularToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors (disabled for hardcoded auth)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // For hardcoded authentication, we don't expect 401 errors from the backend
    // since we're not making real API calls. However, we can still handle
    // other types of errors if needed.
    console.log('API Error intercepted (hardcoded auth mode):', error.message);
    return Promise.reject(error);
  }
);

// Hardcoded Auth services (no API calls)
export const authService = {
  login: async (email: string, password: string) => {
    console.log('⚠️ authService.login called with hardcoded authentication');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Hardcoded users
    const hardcodedUsers = {
      'admin@beautify.com': {
        id: 'admin-123',
        email: 'admin@beautify.com',
        firstName: 'Jane',
        lastName: 'Admin',
        phone: '+1234567891',
        role: 'admin',
        avatar: undefined,
        isActive: true,
        isVerified: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    };
    
    const user = hardcodedUsers[email as keyof typeof hardcodedUsers];
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = `fake-token-${user.id}-${Date.now()}`;
    
    return {
      success: true,
      user,
      token,
      message: 'Login successful'
    };
  },
  
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
  }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    throw new Error('Registration not available in demo mode');
  },
  
  getProfile: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = localStorage.getItem('user');
    if (!user) {
      throw new Error('No user data found');
    }
    
    return {
      success: true,
      user: JSON.parse(user)
    };
  },
  
  updateProfile: async (userData: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      throw new Error('No user data found');
    }
    
    const updatedUser = { ...JSON.parse(currentUser), ...userData };
    
    return {
      success: true,
      user: updatedUser
    };
  },
};

// Hardcoded Merchant Authentication Services (no API calls)
export const merchantAuthService = {
  // Hardcoded merchant login
  login: async (email: string, password: string) => {
    console.log('🔍 merchantAuthService.login called with hardcoded authentication:', { email });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === 'merchant@beautify.com') {
      const user = {
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
      
      const application = {
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
      
      const token = `fake-merchant-token-${user.id}-${Date.now()}`;
      
      console.log('✅ merchantAuthService.login completed successfully');
      return {
        success: true,
        user,
        token,
        merchantApplication: application,
        message: 'Login successful'
      };
    } else {
      throw new Error('Invalid email or password');
    }
  },
  
  // Hardcoded merchant registration
  register: async (merchantData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    businessName: string;
    businessType: 'salon' | 'spa' | 'freelancer' | 'clinic' | 'other';
    businessEmail: string;
    businessPhone: string;
    businessAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
    serviceCategories: string[];
    experienceYears?: number;
    website?: string;
  }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    throw new Error('Registration not available in demo mode');
  },
  
  // Hardcoded merchant application
  applyForMerchantStatus: async (applicationData: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    throw new Error('Application submission not available in demo mode');
  },
  
  // Hardcoded status check
  getStatus: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      application: {
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
      }
    };
  },
  
  // Hardcoded application update
  updateApplication: async (applicationData: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'Application updated successfully'
    };
  },
  
  // Hardcoded email verification
  verifyBusinessEmail: async (token: string, applicationId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'Email verified successfully'
    };
  },
  
  // Hardcoded password reset request
  requestPasswordReset: async (email: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === 'merchant@beautify.com') {
      return {
        success: true,
        message: 'Password reset link sent to your email'
      };
    } else {
      throw new Error('Email not found');
    }
  },
  
  // Hardcoded password reset
  resetPassword: async (token: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'Password reset successfully'
    };
  }
};

// Merchant services
export const merchantService = {
  create: async (merchantData: any) => {
    const response = await api.post('/merchants', merchantData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/merchants/profile');
    return response.data;
  },
  
  update: async (id: string, merchantData: any) => {
    const response = await api.put(`/merchants/${id}`, merchantData);
    return response.data;
  },
  
  search: async (params: any) => {
    const response = await api.get('/merchants/search', { params });
    return response.data;
  },
};

// Service services
export const serviceService = {
  create: async (serviceData: any) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },
  
  getAll: async (params: any) => {
    const response = await api.get('/services', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },
  
  update: async (id: string, serviceData: any) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get('/services/categories');
    return response.data;
  },
};

// Booking services
export const bookingService = {
  getAll: async (params: any) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  
  create: async (bookingData: any) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },
  
  cancel: async (id: string, reason: string) => {
    const response = await api.put(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },
};

// Customer services
export const customerService = {
  getAll: async (params: any) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },
  
  create: async (customerData: any) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },
  
  update: async (id: string, customerData: any) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
};

// Admin/User services
export const userService = {
  // Get all users with advanced filtering
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Get user by ID
  getById: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Create new user
  create: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: string;
    isActive?: boolean;
  }) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  // Update user
  update: async (id: string, userData: any) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  delete: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Toggle user status
  toggleStatus: async (id: string) => {
    const response = await api.patch(`/admin/users/${id}/toggle-status`);
    return response.data;
  },

  // Reset user password
  resetPassword: async (id: string, newPassword: string) => {
    const response = await api.post(`/admin/users/${id}/reset-password`, { password: newPassword });
    return response.data;
  },

  // Get user analytics
  getAnalytics: async (period?: string) => {
    const response = await api.get('/admin/users/analytics', { params: { period } });
    return response.data;
  },
};

// Enhanced Merchant services for admin dashboard
export const adminMerchantService = {
  // Get all merchants with admin privileges
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    location?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await api.get('/admin/merchants', { params });
    return response.data;
  },

  // Get merchant by ID with full details
  getById: async (id: string) => {
    const response = await api.get(`/admin/merchants/${id}`);
    return response.data;
  },

  // Update merchant status
  updateStatus: async (id: string, status: string, reason?: string) => {
    const response = await api.patch(`/admin/merchants/${id}/status`, { status, reason });
    return response.data;
  },

  // Approve merchant verification
  approveVerification: async (id: string) => {
    const response = await api.post(`/admin/merchants/${id}/approve`);
    return response.data;
  },

  // Reject merchant verification
  rejectVerification: async (id: string, reason: string) => {
    const response = await api.post(`/admin/merchants/${id}/reject`, { reason });
    return response.data;
  },

  // Get merchant analytics
  getAnalytics: async (merchantId?: string, period?: string) => {
    const response = await api.get('/admin/merchants/analytics', { 
      params: { merchantId, period } 
    });
    return response.data;
  },
};

// Analytics services
export const analyticsService = {
  getOverview: async (params: any) => {
    const response = await api.get('/analytics/overview', { params });
    return response.data;
  },
  
  getRevenue: async (params: any) => {
    const response = await api.get('/analytics/revenue', { params });
    return response.data;
  },
  
  getBookings: async (params: any) => {
    const response = await api.get('/analytics/bookings', { params });
    return response.data;
  },
  
  getTopServices: async (params: any) => {
    const response = await api.get('/analytics/services/top', { params });
    return response.data;
  },
};

// Payment services
export const paymentService = {
  getAll: async (params: any) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
  
  refund: async (id: string, amount?: number, reason?: string) => {
    const response = await api.post(`/payments/${id}/refund`, { amount, reason });
    return response.data;
  },
  
  getStatistics: async (params: any) => {
    const response = await api.get('/payments/statistics', { params });
    return response.data;
  },
};

// Upload services
export const uploadService = {
  uploadImage: async (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('image', file);
    if (folder) formData.append('folder', folder);
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  uploadImages: async (files: File[], folder?: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    if (folder) formData.append('folder', folder);
    
    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Stripe services
export const stripeService = {
  // Create Stripe Connect account for merchant
  createConnectAccount: async () => {
    const response = await api.post('/stripe/connect/create');
    return response.data;
  },
  
  // Get Stripe Connect account status
  getConnectAccount: async () => {
    const response = await api.get('/stripe/connect/account');
    return response.data;
  },
  
  // Generate Stripe Connect onboarding link
  createOnboardingLink: async (accountId: string, refreshUrl?: string, returnUrl?: string) => {
    const response = await api.post('/stripe/connect/onboarding', {
      accountId,
      refreshUrl: refreshUrl || `${window.location.origin}/merchant/settings?tab=payment`,
      returnUrl: returnUrl || `${window.location.origin}/merchant/settings?tab=payment&success=true`,
    });
    return response.data;
  },
  
  // Generate Stripe Connect dashboard link for account management
  createDashboardLink: async (accountId: string) => {
    const response = await api.post('/stripe/connect/merchant', {
      accountId,
    });
    return response.data;
  },
  
  // Disconnect Stripe account
  disconnectAccount: async () => {
    const response = await api.delete('/stripe/connect/disconnect');
    return response.data;
  },
  
  // Get platform fee configuration
  getPlatformFees: async () => {
    const response = await api.get('/stripe/platform/fees');
    return response.data;
  },
};

// Category services
export const categoryService = {
  // Get all categories
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await api.get('/service-categories', { params });
    return response.data;
  },

  // Get category by ID
  getById: async (id: string) => {
    const response = await api.get(`/service-categories/${id}`);
    return response.data;
  },

  // Create new category
  create: async (categoryData: {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    sortOrder?: number;
  }) => {
    const response = await api.post('/service-categories', categoryData);
    return response.data;
  },

  // Update category
  update: async (id: string, categoryData: {
    name?: string;
    description?: string;
    icon?: string;
    color?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) => {
    const response = await api.put(`/service-categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  delete: async (id: string) => {
    const response = await api.delete(`/service-categories/${id}`);
    return response.data;
  },

  // Toggle category status
  toggleStatus: async (id: string) => {
    const response = await api.patch(`/service-categories/${id}/toggle-status`);
    return response.data;
  },
};

// Product services
export const productService = {
  // Get all products
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create new product
  create: async (productData: any) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  update: async (id: string, productData: any) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get('/product-categories');
    return response.data;
  },
};

// Order services
export const orderService = {
  // Get all orders
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get order by ID
  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status
  updateStatus: async (id: string, status: string, notes?: string) => {
    const response = await api.patch(`/orders/${id}/status`, { status, notes });
    return response.data;
  },

  // Get order analytics
  getAnalytics: async (period?: string) => {
    const response = await api.get('/orders/analytics', { params: { period } });
    return response.data;
  },

  // Process refund
  processRefund: async (id: string, amount: number, reason: string) => {
    const response = await api.post(`/orders/${id}/refund`, { amount, reason });
    return response.data;
  },
};

// Calendar services
export { calendarService } from './calendar';

// Export/Import services
export { exportImportService } from './exportImport';

// GDPR Compliance services
export const gdprService = {
  // Get user data for GDPR requests
  getUserData: async (userId: string) => {
    const response = await api.get(`/gdpr/user-data/${userId}`);
    return response.data;
  },

  // Export user data
  exportUserData: async (userId: string, format: 'json' | 'csv' = 'json') => {
    const response = await api.post(`/gdpr/export-data/${userId}`, { format });
    return response.data;
  },

  // Process data deletion request
  deleteUserData: async (userId: string, reason?: string) => {
    const response = await api.delete(`/gdpr/delete-data/${userId}`, { 
      data: { reason } 
    });
    return response.data;
  },

  // Get consent status
  getConsentStatus: async (userId: string) => {
    const response = await api.get(`/gdpr/consent/${userId}`);
    return response.data;
  },

  // Update consent
  updateConsent: async (userId: string, consents: any) => {
    const response = await api.post(`/gdpr/consent/${userId}`, consents);
    return response.data;
  },

  // Get all GDPR requests
  getRequests: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const response = await api.get('/gdpr/requests', { params });
    return response.data;
  },

  // Process GDPR request
  processRequest: async (requestId: string, action: 'approve' | 'reject', notes?: string) => {
    const response = await api.post(`/gdpr/requests/${requestId}/process`, { action, notes });
    return response.data;
  },
};

// Advanced Analytics Services
export const advancedAnalyticsService = {
  // Platform overview analytics
  getPlatformOverview: async (period?: string) => {
    const response = await api.get('/admin/analytics/platform-overview', { 
      params: { period } 
    });
    return response.data;
  },

  // Revenue analytics
  getRevenueAnalytics: async (params?: {
    period?: string;
    merchantId?: string;
    breakdown?: 'daily' | 'weekly' | 'monthly';
  }) => {
    const response = await api.get('/admin/analytics/revenue', { params });
    return response.data;
  },

  // User growth analytics
  getUserGrowthAnalytics: async (period?: string) => {
    const response = await api.get('/admin/analytics/user-growth', { 
      params: { period } 
    });
    return response.data;
  },

  // Booking analytics
  getBookingAnalytics: async (params?: {
    period?: string;
    merchantId?: string;
    status?: string;
  }) => {
    const response = await api.get('/admin/analytics/bookings', { params });
    return response.data;
  },

  // Top performing services/merchants
  getTopPerformers: async (type: 'services' | 'merchants', period?: string) => {
    const response = await api.get(`/admin/analytics/top-${type}`, { 
      params: { period } 
    });
    return response.data;
  },

  // Financial insights
  getFinancialInsights: async (period?: string) => {
    const response = await api.get('/admin/analytics/financial-insights', { 
      params: { period } 
    });
    return response.data;
  },
};