'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Mail,
  Phone,
  Calendar,
  Star,
  User,
  UserPlus,
  Loader2,
  MessageCircle,
  Send,
  X,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
// Removed API import - using demo data
import toast from 'react-hot-toast';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  totalBookings?: number;
  totalSpent?: number;
  averageRating?: number;
  lastBooking?: string;
  joinedDate: string;
  status: 'active' | 'vip' | 'inactive';
  preferredServices?: string[];
}

interface ApiResponse {
  success: boolean;
  data: Customer[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

interface CommunicationModal {
  isOpen: boolean;
  type: 'email' | 'message' | null;
  customer: Customer | null;
}

interface EmailTemplate {
  subject: string;
  body: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [communicationModal, setCommunicationModal] = useState<CommunicationModal>({
    isOpen: false,
    type: null,
    customer: null,
  });
  const [emailData, setEmailData] = useState<EmailTemplate>({
    subject: '',
    body: '',
  });
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const statuses = ['active', 'vip', 'inactive'];

  // Demo customer data
  const demoCustomers: Customer[] = [
    {
      _id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      email: 'emma.johnson@email.com',
      phone: '+1 (555) 123-4567',
      avatar: undefined,
      totalBookings: 12,
      totalSpent: 1450,
      averageRating: 4.8,
      lastBooking: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      joinedDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'vip',
      preferredServices: ['Facial Treatment', 'Massage', 'Manicure'],
    },
    {
      _id: '2',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.w@email.com',
      phone: '+1 (555) 234-5678',
      avatar: undefined,
      totalBookings: 8,
      totalSpent: 920,
      averageRating: 4.6,
      lastBooking: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      joinedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      preferredServices: ['Hair Services', 'Eyebrow Threading'],
    },
    {
      _id: '3',
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1 (555) 345-6789',
      avatar: undefined,
      totalBookings: 15,
      totalSpent: 2100,
      averageRating: 4.9,
      lastBooking: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      joinedDate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'vip',
      preferredServices: ['Hydrafacial', 'Nail Care', 'Spa Treatments'],
    },
    {
      _id: '4',
      firstName: 'Jessica',
      lastName: 'Brown',
      email: 'jessica.brown@email.com',
      phone: '+1 (555) 456-7890',
      avatar: undefined,
      totalBookings: 3,
      totalSpent: 285,
      averageRating: 4.3,
      lastBooking: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      joinedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      preferredServices: ['Eyebrow Threading', 'Facial'],
    },
    {
      _id: '5',
      firstName: 'Ashley',
      lastName: 'Davis',
      email: 'ashley.davis@email.com',
      phone: '+1 (555) 567-8901',
      avatar: undefined,
      totalBookings: 6,
      totalSpent: 780,
      averageRating: 4.7,
      lastBooking: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      preferredServices: ['Massage', 'Body Treatments', 'Skincare'],
    },
    {
      _id: '6',
      firstName: 'Amanda',
      lastName: 'Wilson',
      email: 'amanda.wilson@email.com',
      phone: '+1 (555) 678-9012',
      avatar: undefined,
      totalBookings: 1,
      totalSpent: 95,
      averageRating: 4.0,
      lastBooking: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      joinedDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'inactive',
      preferredServices: ['Hair Services'],
    },
    {
      _id: '7',
      firstName: 'Lisa',
      lastName: 'Miller',
      email: 'lisa.miller@email.com',
      phone: '+1 (555) 789-0123',
      avatar: undefined,
      totalBookings: 9,
      totalSpent: 1200,
      averageRating: 4.8,
      lastBooking: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      joinedDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      preferredServices: ['Manicure', 'Pedicure', 'Nail Art'],
    },
    {
      _id: '8',
      firstName: 'Jennifer',
      lastName: 'Taylor',
      email: 'jennifer.taylor@email.com',
      phone: '+1 (555) 890-1234',
      avatar: undefined,
      totalBookings: 4,
      totalSpent: 480,
      averageRating: 4.5,
      lastBooking: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      joinedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      preferredServices: ['Facial', 'Skincare'],
    },
  ];

  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, searchTerm, statusFilter]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter demo data based on search and status
      let filteredCustomers = [...demoCustomers];
      
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        filteredCustomers = filteredCustomers.filter(customer =>
          customer.firstName.toLowerCase().includes(query) ||
          customer.lastName.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query)
        );
      }
      
      if (statusFilter) {
        filteredCustomers = filteredCustomers.filter(customer => customer.status === statusFilter);
      }
      
      // Simulate pagination
      const totalItems = filteredCustomers.length;
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
      
      setCustomers(paginatedCustomers);
      setPagination({
        page: pagination.page,
        totalPages: Math.ceil(totalItems / pagination.limit),
        totalItems,
        limit: pagination.limit,
      });
    } catch (err: any) {
      setCustomers([]);
      setError(err.message || 'Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const toggleDropdown = (customerId: string) => {
    setActiveDropdown(activeDropdown === customerId ? null : customerId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const openCommunicationModal = (type: 'email' | 'message', customer: Customer) => {
    setCommunicationModal({
      isOpen: true,
      type,
      customer,
    });
    setActiveDropdown(null);

    // Set default email data for customer
    if (type === 'email') {
      setEmailData({
        subject: `Hello ${customer.firstName}!`,
        body: `Hi ${customer.firstName},\n\nI hope this message finds you well. I wanted to reach out regarding your experience with our services.\n\nPlease let me know if you have any questions or if there's anything I can help you with.\n\nBest regards,\n[Your Name]`,
      });
    } else {
      setMessageText('');
    }
  };

  const closeCommunicationModal = () => {
    setCommunicationModal({
      isOpen: false,
      type: null,
      customer: null,
    });
    setEmailData({ subject: '', body: '' });
    setMessageText('');
  };

  const handleSendEmail = async () => {
    if (!communicationModal.customer || !emailData.subject || !emailData.body) {
      toast.error('Please fill in all email fields');
      return;
    }

    try {
      setIsSending(true);
      
      // Mock API call - in production this would integrate with an email service
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      toast.success(`Email sent to ${communicationModal.customer.firstName} successfully!`);
      closeCommunicationModal();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!communicationModal.customer || !messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setIsSending(true);
      
      // Mock API call - in production this would integrate with a messaging service
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      toast.success(`Message sent to ${communicationModal.customer.firstName} successfully!`);
      closeCommunicationModal();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleCallCustomer = (customer: Customer) => {
    setActiveDropdown(null);
    // In a real app, this might integrate with a calling service or just copy the number
    navigator.clipboard.writeText(customer.phone).then(() => {
      toast.success(`Phone number ${customer.phone} copied to clipboard`);
    }).catch(() => {
      toast.error('Failed to copy phone number');
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships and history</p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-64">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && 'bg-primary-50 border-primary-200')}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Customers Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Loading customers...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading customers</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchCustomers} className="bg-primary-500 hover:bg-primary-600 text-white">
            Try Again
          </Button>
        </div>
      ) : !Array.isArray(customers) || customers.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-600 mb-6">Start building your customer base</p>
          <Button className="bg-primary-500 hover:bg-primary-600 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Your First Customer
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(customers) ? customers.map((customer) => (
            <div
              key={customer._id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative"
            >
              {/* Customer Avatar */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-sm">
                      {getInitials(customer.firstName, customer.lastName)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <span
                      className={cn(
                        'inline-block px-2 py-1 rounded-full text-xs font-medium',
                        getStatusColor(customer.status)
                      )}
                    >
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(customer._id)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {activeDropdown === customer._id && (
                    <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <Link
                        href={`/merchant/customers/${customer._id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                      <button
                        onClick={() => openCommunicationModal('email', customer)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </button>
                      <button
                        onClick={() => handleCallCustomer(customer)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Customer
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {customer.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {customer.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last visit: {customer.lastBooking ? new Date(customer.lastBooking).toLocaleDateString() : 'No previous bookings'}
                </div>
              </div>

              {/* Customer Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center text-blue-600 mb-1">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{customer.totalBookings}</p>
                  <p className="text-xs text-gray-500">Bookings</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-green-600 mb-1">
                    <span className="text-sm">$</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(customer.totalSpent || 0)}
                  </p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-yellow-600 mb-1">
                    <Star className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {(customer.averageRating || 0).toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>

              {/* Preferred Services */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Preferred Services:</p>
                <div className="flex flex-wrap gap-1">
                  {customer.preferredServices.slice(0, 2).map((service, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                  {customer.preferredServices.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{customer.preferredServices.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Link href={`/merchant/customers/${customer._id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
                <div className="relative flex-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => toggleDropdown(`contact-${customer._id}`)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  {activeDropdown === `contact-${customer._id}` && (
                    <div className="absolute bottom-full mb-2 left-0 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <button
                        onClick={() => openCommunicationModal('email', customer)}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </button>
                      <button
                        onClick={() => openCommunicationModal('message', customer)}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )) : null}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === pagination.page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={cn(
                  page === pagination.page && "bg-primary-500 text-white"
                )}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Communication Modal */}
      {communicationModal.isOpen && communicationModal.customer && (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full min-h-screen bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {communicationModal.type === 'email' ? 'Send Email' : 'Send Message'} to {communicationModal.customer.firstName}
              </h3>
              <button
                onClick={closeCommunicationModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {communicationModal.type === 'email' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{communicationModal.customer.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter email subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={emailData.body}
                    onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your email message"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={closeCommunicationModal}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendEmail}
                    disabled={isSending || !emailData.subject || !emailData.body}
                    className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <MessageCircle className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {communicationModal.customer.firstName} {communicationModal.customer.lastName}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Type your message here..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={closeCommunicationModal}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSending || !messageText.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
}