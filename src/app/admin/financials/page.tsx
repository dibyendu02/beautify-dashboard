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
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

interface FinancialStats {
  totalRevenue: number;
  platformFees: number;
  merchantPayouts: number;
  pendingPayouts: number;
  totalTransactions: number;
  averageTransactionValue: number;
  monthlyGrowth: {
    revenue: number;
    transactions: number;
    averageValue: number;
  };
}

interface Transaction {
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
  createdAt: string;
  bookingId?: string;
}

interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

const TRANSACTION_STATUSES = [
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

export default function FinancialsPage() {
  const [financialStats, setFinancialStats] = useState<FinancialStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState<RevenueBreakdown[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFinancialData();
  }, [selectedTimeRange, selectedStatus]);

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mock financial data - In real app, these would be API calls
      const mockStats: FinancialStats = {
        totalRevenue: 245678.50,
        platformFees: 24567.85,
        merchantPayouts: 221110.65,
        pendingPayouts: 12450.30,
        totalTransactions: 8934,
        averageTransactionValue: 87.45,
        monthlyGrowth: {
          revenue: 18.9,
          transactions: 23.4,
          averageValue: -2.1,
        },
      };

      const mockTransactions: Transaction[] = [
        {
          _id: '1',
          merchant: { name: 'Elite Beauty Spa', owner: 'Emma Thompson' },
          customer: { name: 'Sarah Johnson', email: 'sarah@example.com' },
          amount: 150.00,
          platformFee: 15.00,
          merchantPayout: 135.00,
          status: 'completed',
          paymentMethod: 'Credit Card',
          createdAt: '2024-01-15T10:30:00Z',
          bookingId: 'BK-2024-001',
        },
        {
          _id: '2',
          merchant: { name: 'Urban Hair Studio', owner: 'James Rodriguez' },
          customer: { name: 'Mike Wilson', email: 'mike@example.com' },
          amount: 89.99,
          platformFee: 9.00,
          merchantPayout: 80.99,
          status: 'completed',
          paymentMethod: 'PayPal',
          createdAt: '2024-01-15T09:15:00Z',
          bookingId: 'BK-2024-002',
        },
        {
          _id: '3',
          merchant: { name: 'Glow Skincare Clinic', owner: 'Lisa Chen' },
          customer: { name: 'Anna Davis', email: 'anna@example.com' },
          amount: 200.00,
          platformFee: 20.00,
          merchantPayout: 180.00,
          status: 'pending',
          paymentMethod: 'Credit Card',
          createdAt: '2024-01-15T08:45:00Z',
          bookingId: 'BK-2024-003',
        },
      ];

      const mockRevenueBreakdown: RevenueBreakdown[] = [
        { category: 'Hair Services', amount: 98234.50, percentage: 40, color: 'bg-blue-500' },
        { category: 'Facial Treatments', amount: 73675.75, percentage: 30, color: 'bg-green-500' },
        { category: 'Nail Services', amount: 49117.25, percentage: 20, color: 'bg-purple-500' },
        { category: 'Spa Treatments', amount: 24558.50, percentage: 10, color: 'bg-yellow-500' },
      ];

      setFinancialStats(mockStats);
      setTransactions(mockTransactions);
      setRevenueBreakdown(mockRevenueBreakdown);
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError('Failed to load financial data');
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

  const exportFinancialData = () => {
    // Mock export functionality
    toast.success('Financial data exported successfully');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor platform revenue and transactions</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Loading financial data...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor platform revenue and transactions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading financial data</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchFinancialData} className="bg-primary-500 hover:bg-primary-600 text-white">
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
          <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor platform revenue and transactions</p>
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
          <Button onClick={exportFinancialData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(financialStats?.totalRevenue || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {(financialStats?.monthlyGrowth.revenue || 0) >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={cn(
              'text-sm font-medium',
              (financialStats?.monthlyGrowth.revenue || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {Math.abs(financialStats?.monthlyGrowth.revenue || 0)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Fees</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(financialStats?.platformFees || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {((financialStats?.platformFees || 0) / (financialStats?.totalRevenue || 1) * 100).toFixed(1)}% of total revenue
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Merchant Payouts</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(financialStats?.merchantPayouts || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Banknote className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {formatCurrency(financialStats?.pendingPayouts || 0)} pending
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {financialStats?.totalTransactions.toLocaleString() || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Receipt className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Avg: {formatCurrency(financialStats?.averageTransactionValue || 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Breakdown */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue by Category</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {revenueBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={cn('w-3 h-3 rounded-full mr-3', item.color)}></div>
                    <span className="text-sm font-medium text-gray-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.amount)}
                    </p>
                    <p className="text-xs text-gray-500">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {TRANSACTION_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.merchant.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Customer: {transaction.customer.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(transaction.platformFee)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {((transaction.platformFee / transaction.amount) * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                          getStatusColor(transaction.status)
                        )}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(transaction.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}