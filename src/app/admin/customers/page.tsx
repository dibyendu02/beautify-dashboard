'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  Star,
  Heart,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import { cn, formatDate, formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import AdminLayout from '@/components/layout/AdminLayout';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  totalBookings: number;
  totalSpent: number;
  averageRating?: number;
  favoriteServices?: string[];
  lastBookingDate?: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
  };
  preferences?: {
    preferredTime?: string;
    communicationMethod?: string;
    notifications?: boolean;
  };
}

// Demo customer data
const demoCustomers: Customer[] = [
  {
    _id: '3',
    firstName: 'Emma',
    lastName: 'Johnson',
    email: 'emma.johnson@email.com',
    phone: '+1234567892',
    isActive: true,
    createdAt: '2024-02-20T11:00:00Z',
    lastLogin: '2024-03-15T10:30:00Z',
    totalBookings: 12,
    totalSpent: 450,
    averageRating: 4.8,
    favoriteServices: ['Hair Styling', 'Manicure'],
    lastBookingDate: '2024-03-12T15:00:00Z',
    address: { city: 'Los Angeles', state: 'CA', country: 'USA' },
    preferences: {
      preferredTime: 'afternoon',
      communicationMethod: 'email',
      notifications: true
    }
  },
  {
    _id: '5',
    firstName: 'Lisa',
    lastName: 'Davis',
    email: 'lisa.davis@email.com',
    phone: '+1234567894',
    isActive: true,
    createdAt: '2024-03-01T16:45:00Z',
    lastLogin: '2024-03-14T12:20:00Z',
    totalBookings: 5,
    totalSpent: 125,
    averageRating: 4.5,
    favoriteServices: ['Facial Treatment'],
    lastBookingDate: '2024-03-08T14:30:00Z',
    address: { city: 'Miami', state: 'FL', country: 'USA' },
    preferences: {
      preferredTime: 'morning',
      communicationMethod: 'sms',
      notifications: true
    }
  },
  {
    _id: '6',
    firstName: 'David',
    lastName: 'Martinez',
    email: 'david.martinez@email.com',
    phone: '+1234567895',
    isActive: true,
    createdAt: '2024-02-15T13:30:00Z',
    lastLogin: '2024-03-13T15:10:00Z',
    totalBookings: 8,
    totalSpent: 320,
    averageRating: 4.6,
    favoriteServices: ['Haircut', 'Beard Trim'],
    lastBookingDate: '2024-03-10T11:00:00Z',
    address: { city: 'Houston', state: 'TX', country: 'USA' },
    preferences: {
      preferredTime: 'evening',
      communicationMethod: 'phone',
      notifications: false
    }
  },
  {
    _id: '8',
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'robert.taylor@email.com',
    phone: '+1234567897',
    isActive: false,
    createdAt: '2024-01-20T08:45:00Z',
    totalBookings: 2,
    totalSpent: 80,
    averageRating: 3.5,
    favoriteServices: ['Massage'],
    lastBookingDate: '2024-02-15T16:00:00Z',
    address: { city: 'Philadelphia', state: 'PA', country: 'USA' },
    preferences: {
      preferredTime: 'morning',
      communicationMethod: 'email',
      notifications: false
    }
  },
  {
    _id: '9',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@email.com',
    phone: '+1234567898',
    isActive: true,
    createdAt: '2024-01-10T12:15:00Z',
    lastLogin: '2024-03-14T18:45:00Z',
    totalBookings: 15,
    totalSpent: 675,
    averageRating: 4.9,
    favoriteServices: ['Hair Coloring', 'Pedicure', 'Eyebrow Threading'],
    lastBookingDate: '2024-03-14T10:30:00Z',
    address: { city: 'San Antonio', state: 'TX', country: 'USA' },
    preferences: {
      preferredTime: 'afternoon',
      communicationMethod: 'sms',
      notifications: true
    }
  },
  {
    _id: '10',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@email.com',
    phone: '+1234567899',
    isActive: true,
    createdAt: '2024-02-05T14:20:00Z',
    lastLogin: '2024-03-15T09:15:00Z',
    totalBookings: 6,
    totalSpent: 240,
    averageRating: 4.3,
    favoriteServices: ['Hair Styling'],
    lastBookingDate: '2024-03-11T13:45:00Z',
    address: { city: 'Denver', state: 'CO', country: 'USA' },
    preferences: {
      preferredTime: 'morning',
      communicationMethod: 'email',
      notifications: true
    }
  },
  {
    _id: '11',
    firstName: 'Anna',
    lastName: 'Thompson',
    email: 'anna.thompson@email.com',
    phone: '+1234567800',
    isActive: true,
    createdAt: '2024-01-25T09:30:00Z',
    lastLogin: '2024-03-13T20:10:00Z',
    totalBookings: 20,
    totalSpent: 950,
    averageRating: 4.7,
    favoriteServices: ['Full Spa Package', 'Massage', 'Facial Treatment'],
    lastBookingDate: '2024-03-13T14:00:00Z',
    address: { city: 'Seattle', state: 'WA', country: 'USA' },
    preferences: {
      preferredTime: 'weekend',
      communicationMethod: 'email',
      notifications: true
    }
  },
  // Additional demo customers for pagination testing
  ...Array.from({ length: 35 }, (_, i) => ({
    _id: `${16 + i}`,
    firstName: ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Logan'][i % 10],
    lastName: ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez'][i % 10],
    email: `customer${16 + i}@email.com`,
    phone: `+123456${7950 + i}`,
    isActive: Math.random() > 0.15,
    createdAt: new Date(2024, 0, 1 + (i * 2)).toISOString(),
    lastLogin: Math.random() > 0.1 ? new Date(2024, 2, 1 + (i % 15)).toISOString() : undefined,
    totalBookings: Math.floor(Math.random() * 25) + 1,
    totalSpent: Math.floor(Math.random() * 1200) + 50,
    averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
    favoriteServices: [
      ['Hair Styling', 'Manicure'],
      ['Massage', 'Facial Treatment'],
      ['Hair Coloring', 'Pedicure'],
      ['Eyebrow Threading', 'Hair Styling'],
      ['Facial Treatment', 'Massage']
    ][i % 5],
    lastBookingDate: Math.random() > 0.2 ? new Date(2024, 2, 1 + (i % 14)).toISOString() : undefined,
    address: {
      city: ['Boston', 'San Francisco', 'Las Vegas', 'Detroit', 'Orlando', 'Phoenix', 'Charlotte', 'Memphis'][i % 8],
      state: ['MA', 'CA', 'NV', 'MI', 'FL', 'AZ', 'NC', 'TN'][i % 8],
      country: 'USA'
    },
    preferences: {
      preferredTime: ['morning', 'afternoon', 'evening', 'weekend'][i % 4],
      communicationMethod: ['email', 'sms', 'phone'][i % 3],
      notifications: Math.random() > 0.3
    }
  }))
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('totalSpent');
  const [customers, setCustomers] = useState<Customer[]>(demoCustomers);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = customers.filter(customer => {
      const matchesSearch = !searchTerm || 
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !selectedStatus || 
        (selectedStatus === 'active' && customer.isActive) ||
        (selectedStatus === 'inactive' && !customer.isActive);
      
      return matchesSearch && matchesStatus;
    });

    // Sort customers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'totalBookings':
          return b.totalBookings - a.totalBookings;
        case 'averageRating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [customers, searchTerm, selectedStatus, sortBy]);

  // Paginate filtered customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedCustomers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const refreshCustomers = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleCustomerAction = (action: string, customerId: string) => {
    switch (action) {
      case 'toggle-status':
        setCustomers(prev => prev.map(customer => 
          customer._id === customerId 
            ? { ...customer, isActive: !customer.isActive }
            : customer
        ));
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this customer?')) {
          setCustomers(prev => prev.filter(customer => customer._id !== customerId));
        }
        break;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 500) return { label: 'VIP', color: 'bg-purple-100 text-purple-800' };
    if (totalSpent >= 200) return { label: 'Gold', color: 'bg-yellow-100 text-yellow-800' };
    if (totalSpent >= 100) return { label: 'Silver', color: 'bg-gray-100 text-gray-800' };
    return { label: 'Bronze', color: 'bg-orange-100 text-orange-800' };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and monitor all customer accounts and their activity
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshCustomers}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.reduce((sum, c) => sum + c.totalBookings, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(customers.reduce((sum, c) => sum + (c.averageRating || 0), 0) / customers.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="totalSpent">Sort by Spending</option>
              <option value="totalBookings">Sort by Bookings</option>
              <option value="averageRating">Sort by Rating</option>
              <option value="createdAt">Sort by Join Date</option>
            </select>

            {/* Export Button */}
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            // Loading skeleton
            <div className="p-4">
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-20 h-6 bg-gray-200 rounded"></div>
                    <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : paginatedCustomers.length === 0 ? (
            // Empty state
            <div className="p-8 text-center">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedStatus 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first customer.'
                }
              </p>
            </div>
          ) : (
            // Customers list
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Booking
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedCustomers.map((customer) => {
                    const tier = getCustomerTier(customer.totalSpent);
                    return (
                      <tr key={customer._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.firstName} {customer.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                              {customer.phone && (
                                <div className="text-sm text-gray-500">{customer.phone}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            tier.color
                          )}>
                            {tier.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getStatusColor(customer.isActive)
                          )}>
                            {customer.isActive ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {customer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.totalBookings}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(customer.totalSpent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {customer.averageRating?.toFixed(1) || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.lastBookingDate ? formatDate(customer.lastBookingDate) : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCustomerAction('toggle-status', customer._id)}
                            >
                              {customer.isActive ? (
                                <Ban className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCustomerAction('delete', customer._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination - only show when there's more than one page */}
        {filteredAndSortedCustomers.length > itemsPerPage && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredAndSortedCustomers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              showItemsPerPageSelector={true}
              showTotalItems={true}
              showPageNumbers={true}
              maxPageNumbers={7}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}