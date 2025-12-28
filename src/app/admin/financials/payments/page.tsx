'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  AlertCircle,
  Download,
  Filter,
  Calendar,
  Receipt,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  PieChart,
  Wallet,
  Banknote,
  Users,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface Payment {
  _id: string;
  merchant: {
    name: string;
    owner: string;
  };
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  platformFee: number;
  merchantPayout: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  serviceName: string;
  createdAt: string;
  bookingId?: string;
}

interface PaymentStats {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
  totalAmount: number;
  platformFeesCollected: number;
  growth: {
    payments: number;
    amount: number;
  };
}

const PAYMENT_STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

const TIME_RANGES = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last Year' },
];

export default function PaymentsPage() {
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentData();
  }, [selectedTimeRange, selectedStatus]);

  const fetchPaymentData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mock payment data - In real app, these would be API calls
      const mockStats: PaymentStats = {
        totalPayments: 4567,
        completedPayments: 4123,
        pendingPayments: 234,
        failedPayments: 156,
        refundedPayments: 54,
        totalAmount: 456789.50,
        platformFeesCollected: 45678.95,
        growth: {
          payments: 12.5,
          amount: 18.3,
        },
      };

      const mockPayments: Payment[] = [
        {
          _id: '1',
          merchant: { name: 'Glamour Spa', owner: 'Emma Thompson' },
          customer: { name: 'Sarah Johnson', email: 'sarah@example.com' },
          amount: 125.00,
          platformFee: 12.50,
          merchantPayout: 112.50,
          status: 'completed',
          paymentMethod: 'Visa •••• 4242',
          transactionId: 'TXN_001234567',
          serviceName: 'Full Body Massage',
          createdAt: '2024-01-15T10:30:00Z',
          bookingId: 'BK-2024-001',
        },
        {
          _id: '2',
          merchant: { name: 'Hair Studio Pro', owner: 'James Rodriguez' },
          customer: { name: 'Emily Davis', email: 'emily@example.com' },
          amount: 85.00,
          platformFee: 8.50,
          merchantPayout: 76.50,
          status: 'pending',
          paymentMethod: 'Mastercard •••• 8888',
          transactionId: 'TXN_001234568',
          serviceName: 'Hair Cut & Color',
          createdAt: '2024-01-15T09:15:00Z',
          bookingId: 'BK-2024-002',
        },
        {
          _id: '3',
          merchant: { name: 'Nails & More', owner: 'Jessica Wilson' },
          customer: { name: 'Anna Davis', email: 'anna@example.com' },
          amount: 65.00,
          platformFee: 6.50,
          merchantPayout: 58.50,
          status: 'failed',
          paymentMethod: 'Visa •••• 1234',
          transactionId: 'TXN_001234569',
          serviceName: 'Manicure & Pedicure',
          createdAt: '2024-01-14T16:45:00Z',
          bookingId: 'BK-2024-003',
        },
        {
          _id: '4',
          merchant: { name: 'Beauty Boutique', owner: 'Amanda Brown' },
          customer: { name: 'Maria Garcia', email: 'maria@example.com' },
          amount: 150.00,
          platformFee: 15.00,
          merchantPayout: 135.00,
          status: 'refunded',
          paymentMethod: 'Apple Pay',
          transactionId: 'TXN_001234570',
          serviceName: 'Facial Treatment',
          createdAt: '2024-01-14T14:20:00Z',
          bookingId: 'BK-2024-004',
        },
        {
          _id: '5',
          merchant: { name: 'Wellness Center', owner: 'Lisa Zhang' },
          customer: { name: 'Jennifer Smith', email: 'jennifer@example.com' },
          amount: 200.00,
          platformFee: 20.00,
          merchantPayout: 180.00,
          status: 'completed',
          paymentMethod: 'Visa •••• 5555',
          transactionId: 'TXN_001234571',
          serviceName: 'Spa Package',
          createdAt: '2024-01-13T11:00:00Z',
          bookingId: 'BK-2024-005',
        },
      ];

      setPaymentStats(mockStats);
      setPayments(mockPayments);
    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError('Failed to load payment data');
    } finally {
      setIsLoading(false);
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
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'failed':
        return <XCircle className="w-3 h-3" />;
      case 'refunded':
        return <RefreshCw className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = selectedStatus === '' || payment.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      payment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportPaymentData = () => {
    // Mock export functionality
    toast.success('Payment data exported successfully');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all payment transactions</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Loading payment data...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all payment transactions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading payment data</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchPaymentData} className="bg-primary-500 hover:bg-primary-600 text-white">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all payment transactions</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <Button onClick={exportPaymentData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                {paymentStats?.totalPayments.toLocaleString() || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {(paymentStats?.growth.payments || 0) >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={cn(
              'text-sm font-medium',
              (paymentStats?.growth.payments || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {Math.abs(paymentStats?.growth.payments || 0)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(paymentStats?.totalAmount || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {(paymentStats?.growth.amount || 0) >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={cn(
              'text-sm font-medium',
              (paymentStats?.growth.amount || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {Math.abs(paymentStats?.growth.amount || 0)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {paymentStats?.completedPayments.toLocaleString() || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {((paymentStats?.completedPayments || 0) / (paymentStats?.totalPayments || 1) * 100).toFixed(1)}% success rate
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Fees</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(paymentStats?.platformFeesCollected || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {((paymentStats?.platformFeesCollected || 0) / (paymentStats?.totalAmount || 1) * 100).toFixed(1)}% of total
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by customer, merchant, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {PAYMENT_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Payment Transactions ({filteredPayments.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Merchant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Platform Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.transactionId}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.serviceName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.merchant.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.merchant.owner}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(payment.platformFee)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((payment.platformFee / payment.amount) * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                      getStatusColor(payment.status)
                    )}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1">{payment.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </>
  );
}