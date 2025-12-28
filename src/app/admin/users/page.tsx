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
  Shield,
  User,
  Store,
  Calendar,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  totalBookings?: number;
  totalSpent?: number;
  address?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

// Demo data - expanded for pagination testing
const demoUsers: User[] = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Admin',
    email: 'admin@beautify.com',
    phone: '+1234567890',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-03-15T14:20:00Z',
  },
  {
    _id: '2',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+1234567891',
    role: 'merchant',
    isActive: true,
    createdAt: '2024-02-10T09:15:00Z',
    lastLogin: '2024-03-14T16:45:00Z',
    totalBookings: 145,
    totalSpent: 2850,
    address: { city: 'New York', state: 'NY', country: 'USA' }
  },
  {
    _id: '3',
    firstName: 'Emma',
    lastName: 'Johnson',
    email: 'emma.johnson@email.com',
    phone: '+1234567892',
    role: 'customer',
    isActive: true,
    createdAt: '2024-02-20T11:00:00Z',
    lastLogin: '2024-03-15T10:30:00Z',
    totalBookings: 12,
    totalSpent: 450,
    address: { city: 'Los Angeles', state: 'CA', country: 'USA' }
  },
  {
    _id: '4',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    phone: '+1234567893',
    role: 'merchant',
    isActive: false,
    createdAt: '2024-01-25T14:20:00Z',
    lastLogin: '2024-03-10T08:15:00Z',
    totalBookings: 89,
    totalSpent: 1780,
    address: { city: 'Chicago', state: 'IL', country: 'USA' }
  },
  {
    _id: '5',
    firstName: 'Lisa',
    lastName: 'Davis',
    email: 'lisa.davis@email.com',
    phone: '+1234567894',
    role: 'customer',
    isActive: true,
    createdAt: '2024-03-01T16:45:00Z',
    lastLogin: '2024-03-14T12:20:00Z',
    totalBookings: 5,
    totalSpent: 125,
    address: { city: 'Miami', state: 'FL', country: 'USA' }
  },
  {
    _id: '6',
    firstName: 'David',
    lastName: 'Martinez',
    email: 'david.martinez@email.com',
    phone: '+1234567895',
    role: 'customer',
    isActive: true,
    createdAt: '2024-02-15T13:30:00Z',
    lastLogin: '2024-03-13T15:10:00Z',
    totalBookings: 8,
    totalSpent: 320,
    address: { city: 'Houston', state: 'TX', country: 'USA' }
  },
  {
    _id: '7',
    firstName: 'Jessica',
    lastName: 'Garcia',
    email: 'jessica.garcia@email.com',
    role: 'merchant',
    isActive: true,
    createdAt: '2024-01-30T10:15:00Z',
    lastLogin: '2024-03-15T09:45:00Z',
    totalBookings: 203,
    totalSpent: 4050,
    address: { city: 'Phoenix', state: 'AZ', country: 'USA' }
  },
  {
    _id: '8',
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'robert.taylor@email.com',
    phone: '+1234567897',
    role: 'customer',
    isActive: false,
    createdAt: '2024-01-20T08:45:00Z',
    totalBookings: 2,
    totalSpent: 80,
    address: { city: 'Philadelphia', state: 'PA', country: 'USA' }
  },
  // Additional demo users for pagination testing
  {
    _id: '9',
    firstName: 'Amanda',
    lastName: 'Chen',
    email: 'amanda.chen@email.com',
    phone: '+1234567898',
    role: 'customer',
    isActive: true,
    createdAt: '2024-02-28T14:15:00Z',
    lastLogin: '2024-03-15T11:20:00Z',
    totalBookings: 15,
    totalSpent: 720,
    address: { city: 'Seattle', state: 'WA', country: 'USA' }
  },
  {
    _id: '10',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+1234567899',
    role: 'merchant',
    isActive: true,
    createdAt: '2024-01-08T09:30:00Z',
    lastLogin: '2024-03-14T13:45:00Z',
    totalBookings: 87,
    totalSpent: 1940,
    address: { city: 'Austin', state: 'TX', country: 'USA' }
  },
  {
    _id: '11',
    firstName: 'Sophia',
    lastName: 'Anderson',
    email: 'sophia.anderson@email.com',
    phone: '+1234567900',
    role: 'customer',
    isActive: true,
    createdAt: '2024-02-05T16:20:00Z',
    lastLogin: '2024-03-15T08:30:00Z',
    totalBookings: 9,
    totalSpent: 385,
    address: { city: 'Denver', state: 'CO', country: 'USA' }
  },
  {
    _id: '12',
    firstName: 'Marcus',
    lastName: 'Thompson',
    email: 'marcus.thompson@email.com',
    phone: '+1234567901',
    role: 'customer',
    isActive: false,
    createdAt: '2024-01-12T11:45:00Z',
    lastLogin: '2024-02-28T15:20:00Z',
    totalBookings: 3,
    totalSpent: 150,
    address: { city: 'Portland', state: 'OR', country: 'USA' }
  },
  {
    _id: '13',
    firstName: 'Isabella',
    lastName: 'Martinez',
    email: 'isabella.martinez@email.com',
    phone: '+1234567902',
    role: 'merchant',
    isActive: true,
    createdAt: '2024-01-22T12:30:00Z',
    lastLogin: '2024-03-15T10:15:00Z',
    totalBookings: 156,
    totalSpent: 3120,
    address: { city: 'San Diego', state: 'CA', country: 'USA' }
  },
  {
    _id: '14',
    firstName: 'Alex',
    lastName: 'Williams',
    email: 'alex.williams@email.com',
    phone: '+1234567903',
    role: 'customer',
    isActive: true,
    createdAt: '2024-03-05T13:15:00Z',
    lastLogin: '2024-03-15T14:45:00Z',
    totalBookings: 7,
    totalSpent: 210,
    address: { city: 'Nashville', state: 'TN', country: 'USA' }
  },
  {
    _id: '15',
    firstName: 'Victoria',
    lastName: 'Lee',
    email: 'victoria.lee@email.com',
    phone: '+1234567904',
    role: 'customer',
    isActive: true,
    createdAt: '2024-02-18T10:45:00Z',
    lastLogin: '2024-03-14T17:30:00Z',
    totalBookings: 11,
    totalSpent: 495,
    address: { city: 'Atlanta', state: 'GA', country: 'USA' }
  },
  // Continue adding more users to reach 50+ for comprehensive pagination testing
  ...Array.from({ length: 35 }, (_, i) => ({
    _id: `${16 + i}`,
    firstName: ['Emily', 'James', 'Olivia', 'William', 'Ava', 'Benjamin', 'Sophia', 'Lucas', 'Charlotte', 'Henry'][i % 10],
    lastName: ['Smith', 'Johnson', 'Brown', 'Taylor', 'Miller', 'Wilson', 'Moore', 'Davis', 'Anderson', 'Jackson'][i % 10],
    email: `user${16 + i}@email.com`,
    phone: `+123456${7905 + i}`,
    role: ['customer', 'merchant', 'customer', 'customer', 'merchant'][i % 5] as 'customer' | 'merchant' | 'admin',
    isActive: Math.random() > 0.2,
    createdAt: new Date(2024, 0, 1 + (i * 3)).toISOString(),
    lastLogin: Math.random() > 0.1 ? new Date(2024, 2, 1 + (i % 15)).toISOString() : undefined,
    totalBookings: Math.floor(Math.random() * 50),
    totalSpent: Math.floor(Math.random() * 2000),
    address: {
      city: ['Boston', 'San Francisco', 'Las Vegas', 'Detroit', 'Orlando'][i % 5],
      state: ['MA', 'CA', 'NV', 'MI', 'FL'][i % 5],
      country: 'USA'
    }
  }))
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [users, setUsers] = useState<User[]>(demoUsers);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = !selectedRole || user.role === selectedRole;
      
      const matchesStatus = !selectedStatus || 
        (selectedStatus === 'active' && user.isActive) ||
        (selectedStatus === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const refreshUsers = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleUserAction = (action: string, userId: string) => {
    switch (action) {
      case 'toggle-status':
        setUsers(prev => prev.map(user => 
          user._id === userId 
            ? { ...user, isActive: !user.isActive }
            : user
        ));
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this user?')) {
          setUsers(prev => prev.filter(user => user._id !== userId));
        }
        break;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'merchant': return Store;
      case 'customer': return User;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'merchant': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and monitor all platform users
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshUsers}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="merchant">Merchant</option>
              <option value="customer">Customer</option>
            </select>

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
          </div>
        </div>

        {/* Users Table */}
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
          ) : paginatedUsers.length === 0 ? (
            // Empty state
            <div className="p-8 text-center">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedRole || selectedStatus 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first user.'
                }
              </p>
            </div>
          ) : (
            // Users list
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.phone && (
                                <div className="text-sm text-gray-500">{user.phone}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getRoleColor(user.role)
                          )}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getStatusColor(user.isActive)
                          )}>
                            {user.isActive ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction('toggle-status', user._id)}
                            >
                              {user.isActive ? (
                                <Ban className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction('delete', user._id)}
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
        {filteredUsers.length > itemsPerPage && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredUsers.length}
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
    </>
  );
}