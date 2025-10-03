// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'merchant' | 'admin';
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Merchant types
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface ContactInfo {
  phone: string;
  email: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

export interface Merchant {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  address: Address;
  contactInfo: ContactInfo;
  businessHours: BusinessHours;
  images: string[];
  categories: string[];
  averageRating: number;
  totalReviews: number;
  isVerified: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isVIP: boolean;
  currency: string;
  acceptedPaymentMethods: string[];
  createdAt: string;
  updatedAt: string;
}

// Service types
export interface ServiceVariant {
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export interface Service {
  id: string;
  merchantId: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  price: number;
  currency: string;
  duration: number;
  images: string[];
  variants: ServiceVariant[];
  isActive: boolean;
  isPopular: boolean;
  totalBookings: number;
  averageRating: number;
  totalReviews: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Booking types
export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ServiceDetails {
  title: string;
  duration: number;
  price: number;
  currency: string;
  variant?: string;
}

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

export interface Booking {
  id: string;
  customerId: string;
  merchantId: string;
  serviceId: string;
  appointmentDate: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  serviceDetails: ServiceDetails;
  customerDetails: CustomerDetails;
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  totalAmount: number;
  currency: string;
  promoCode?: string;
  discount?: Discount;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  filters?: any;
  errors?: string[];
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'merchant';
}

export interface ServiceForm {
  title: string;
  description: string;
  category: string;
  subCategory: string;
  price: number;
  duration: number;
  tags: string[];
  variants: ServiceVariant[];
  images: File[] | string[];
}

export interface MerchantForm {
  businessName: string;
  description: string;
  address: Address;
  contactInfo: ContactInfo;
  businessHours: BusinessHours;
  categories: string[];
  acceptedPaymentMethods: string[];
  images: File[] | string[];
}

// Dashboard types
export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalServices: number;
  averageRating: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  recentBookings: Booking[];
  recentReviews: any[];
  monthlyRevenue: { month: string; revenue: number; bookings: number }[];
}

// Filter types
export interface ServiceFilters {
  search?: string;
  category?: string;
  subCategory?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BookingFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  serviceId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}