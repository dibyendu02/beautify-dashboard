'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  Download,
  Eye,
  Filter,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  MoreVertical,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
// Removed API import - using demo data
import toast from 'react-hot-toast';

interface Payment {
  _id: string;
  paymentId: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  booking: {
    service: {
      name: string;
    };
  };
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  processingFee: number;
  netAmount: number;
}

interface PaymentSummary {
  totalRevenue: number;
  totalFees: number;
  netRevenue: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
  successRate: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
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

  const statuses = ['completed', 'pending', 'failed', 'refunded'];

  // Demo payment data
  const demoPayments: Payment[] = [
    {
      _id: '1',
      paymentId: 'PAY_001',
      customer: { firstName: 'Emma', lastName: 'Johnson' },
      booking: { service: { name: 'Classic Facial Treatment' } },
      amount: 120,
      status: 'completed',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN_ABC123',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      processingFee: 3.6,
      netAmount: 116.4,
    },
    {
      _id: '2',
      paymentId: 'PAY_002',
      customer: { firstName: 'Sarah', lastName: 'Williams' },
      booking: { service: { name: 'Deep Tissue Massage' } },
      amount: 150,
      status: 'pending',
      paymentMethod: 'PayPal',
      transactionId: 'TXN_DEF456',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      processingFee: 4.5,
      netAmount: 145.5,
    },
    {
      _id: '3',
      paymentId: 'PAY_003',
      customer: { firstName: 'Maria', lastName: 'Garcia' },
      booking: { service: { name: 'Gel Manicure & Pedicure' } },
      amount: 85,
      status: 'completed',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN_GHI789',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      processingFee: 2.55,
      netAmount: 82.45,
    },
    {
      _id: '4',
      paymentId: 'PAY_004',
      customer: { firstName: 'Jessica', lastName: 'Brown' },
      booking: { service: { name: 'Eyebrow Threading & Tinting' } },
      amount: 65,
      status: 'completed',
      paymentMethod: 'Debit Card',
      transactionId: 'TXN_JKL012',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      processingFee: 1.95,
      netAmount: 63.05,
    },
    {
      _id: '5',
      paymentId: 'PAY_005',
      customer: { firstName: 'Ashley', lastName: 'Davis' },
      booking: { service: { name: 'Hydrafacial Treatment' } },
      amount: 180,
      status: 'failed',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN_MNO345',
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      processingFee: 0,
      netAmount: 0,
    },
    {
      _id: '6',
      paymentId: 'PAY_006',
      customer: { firstName: 'Amanda', lastName: 'Wilson' },
      booking: { service: { name: 'Hair Cut & Style' } },
      amount: 95,
      status: 'refunded',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN_PQR678',
      createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
      processingFee: -2.85,
      netAmount: 0,
    },
  ];

  const demoPaymentSummary: PaymentSummary = {
    totalRevenue: 695,
    totalFees: 9.6,
    netRevenue: 685.4,
    completedPayments: 4,
    pendingPayments: 1,
    failedPayments: 1,
    refundedPayments: 1,
    successRate: 85.7,
  };

  useEffect(() => {
    fetchPayments();
  }, [pagination.page, searchTerm, statusFilter]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 900));

      // Filter demo data based on search and status
      let filteredPayments = [...demoPayments];
      
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        filteredPayments = filteredPayments.filter(payment =>
          payment.customer.firstName.toLowerCase().includes(query) ||
          payment.customer.lastName.toLowerCase().includes(query) ||
          payment.booking.service.name.toLowerCase().includes(query) ||
          payment.paymentId.toLowerCase().includes(query)
        );
      }
      
      if (statusFilter) {
        filteredPayments = filteredPayments.filter(payment => payment.status === statusFilter);
      }
      
      // Simulate pagination
      const totalItems = filteredPayments.length;
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedPayments = filteredPayments.slice(startIndex, endIndex);
      
      setPayments(paginatedPayments);
      setPagination({
        page: pagination.page,
        totalPages: Math.ceil(totalItems / pagination.limit),
        totalItems,
        limit: pagination.limit,
      });
      
      setPaymentSummary(demoPaymentSummary);

    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err.message || 'Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefund = async (paymentId: string, amount?: number, reason?: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Refund processed successfully');
      
      // Update payment status locally
      setPayments(prev =>
        prev.map(payment =>
          payment._id === paymentId 
            ? { ...payment, status: 'refunded' as any, netAmount: 0 }
            : payment
        )
      );
    } catch (err: any) {
      toast.error('Failed to process refund');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const toggleDropdown = (paymentId: string) => {
    setActiveDropdown(activeDropdown === paymentId ? null : paymentId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'refunded':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">Track your payment transactions and revenue</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Loading payments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">Track your payment transactions and revenue</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading payments</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchPayments} className="bg-blue-500 hover:bg-blue-600 text-white border-0">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Track your payment transactions and revenue</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white border-0">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(paymentSummary?.totalRevenue || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing Fees</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(paymentSummary?.totalFees || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Platform fees</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(paymentSummary?.netRevenue || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">After fees</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{paymentSummary?.successRate || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Payment success</p>
        </div>
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
                placeholder="Search by customer, service, or payment ID..."
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

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-sm">No payments found</p>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.paymentId}</div>
                      <div className="text-sm text-gray-500">{payment.transactionId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.customer.firstName} {payment.customer.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{payment.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.booking.service.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                      {payment.processingFee > 0 && (
                        <div className="text-sm text-gray-500">Fee: {formatCurrency(payment.processingFee)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span
                          className={cn(
                            'ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                            getStatusColor(payment.status)
                          )}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(payment._id)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {activeDropdown === payment._id && (
                          <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                            <button
                              onClick={() => {}}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => {}}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Receipt
                            </button>
                            {payment.status === 'completed' && (
                              <button
                                onClick={() => handleRefund(payment._id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Issue Refund
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                variant={page === pagination.page ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={cn(
                  page === pagination.page && "bg-blue-500 hover:bg-blue-600 text-white border-0"
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