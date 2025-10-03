'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  RefreshCw,
  Download,
  Calendar,
  Filter,
  Search,
  Eye,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  AlertCircle,
  CheckCircle,
  Clock,
  PieChart,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface Transaction {
  _id: string;
  type: 'income' | 'expense' | 'refund' | 'commission';
  amount: number;
  description: string;
  category: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  customer?: {
    name: string;
    email: string;
  };
  booking?: {
    _id: string;
    service: string;
  };
}

interface PayoutRequest {
  _id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  processedAt?: string;
  bankAccount: string;
}

interface FinancialStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingPayouts: number;
  avgTransactionValue: number;
  monthlyGrowth: number;
  totalCommissions: number;
  availableBalance: number;
}

const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function AdvancedFinancialManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [financialStats, setFinancialStats] = useState<FinancialStats | null>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadFinancialData();
  }, [selectedPeriod]);

  const loadFinancialData = async () => {
    try {
      setIsLoading(true);
      
      // Mock API calls - replace with actual API
      const [statsRes, transactionsRes, payoutsRes, revenueRes] = await Promise.allSettled([
        fetch(`/api/financial/stats?period=${selectedPeriod}`).then(r => r.json()).catch(() => generateMockStats()),
        fetch(`/api/financial/transactions?period=${selectedPeriod}`).then(r => r.json()).catch(() => generateMockTransactions()),
        fetch(`/api/financial/payouts`).then(r => r.json()).catch(() => generateMockPayouts()),
        fetch(`/api/financial/revenue-chart?period=${selectedPeriod}`).then(r => r.json()).catch(() => generateMockRevenueData()),
      ]);

      if (statsRes.status === 'fulfilled') setFinancialStats(statsRes.value);
      if (transactionsRes.status === 'fulfilled') setTransactions(transactionsRes.value);
      if (payoutsRes.status === 'fulfilled') setPayoutRequests(payoutsRes.value);
      if (revenueRes.status === 'fulfilled') setRevenueData(revenueRes.value);

    } catch (error) {
      console.error('Error loading financial data:', error);
      toast.error('Failed to load financial data');
      
      // Load mock data as fallback
      setFinancialStats(generateMockStats());
      setTransactions(generateMockTransactions());
      setPayoutRequests(generateMockPayouts());
      setRevenueData(generateMockRevenueData());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockStats = (): FinancialStats => ({
    totalRevenue: 12450.00,
    totalExpenses: 2340.00,
    netProfit: 10110.00,
    pendingPayouts: 1250.00,
    avgTransactionValue: 85.50,
    monthlyGrowth: 12.5,
    totalCommissions: 890.00,
    availableBalance: 8860.00,
  });

  const generateMockTransactions = (): Transaction[] => [
    {
      _id: '1',
      type: 'income',
      amount: 120.00,
      description: 'Hair Styling Service',
      category: 'Service',
      date: new Date().toISOString(),
      status: 'completed',
      paymentMethod: 'Card',
      customer: { name: 'Sarah Johnson', email: 'sarah@example.com' },
      booking: { _id: 'b1', service: 'Hair Styling' }
    },
    {
      _id: '2',
      type: 'commission',
      amount: -8.40,
      description: 'Platform Commission (7%)',
      category: 'Commission',
      date: new Date(Date.now() - 3600000).toISOString(),
      status: 'completed',
      paymentMethod: 'Auto Deduction',
    },
    {
      _id: '3',
      type: 'income',
      amount: 95.00,
      description: 'Facial Treatment',
      category: 'Service',
      date: new Date(Date.now() - 7200000).toISOString(),
      status: 'completed',
      paymentMethod: 'Cash',
      customer: { name: 'Emma Wilson', email: 'emma@example.com' },
    },
  ];

  const generateMockPayouts = (): PayoutRequest[] => [
    {
      _id: '1',
      amount: 1250.00,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      bankAccount: '****1234',
    },
    {
      _id: '2',
      amount: 890.00,
      status: 'completed',
      requestedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      processedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      bankAccount: '****1234',
    },
  ];

  const generateMockRevenueData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 500) + 200,
        expenses: Math.floor(Math.random() * 100) + 50,
        profit: 0,
      });
    }
    return data.map(d => ({ ...d, profit: d.revenue - d.expenses }));
  };

  const exportFinancialReport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      toast.loading('Generating financial report...', { id: 'export' });
      
      // Mock export - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Financial report exported as ${format.toUpperCase()}`, { id: 'export' });
    } catch (error) {
      toast.error('Failed to export report', { id: 'export' });
    }
  };

  const requestPayout = async () => {
    try {
      toast.loading('Processing payout request...', { id: 'payout' });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPayout: PayoutRequest = {
        _id: Date.now().toString(),
        amount: financialStats?.availableBalance || 0,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        bankAccount: '****1234',
      };
      
      setPayoutRequests(prev => [newPayout, ...prev]);
      
      if (financialStats) {
        setFinancialStats({
          ...financialStats,
          availableBalance: 0,
          pendingPayouts: financialStats.availableBalance,
        });
      }
      
      toast.success('Payout request submitted successfully', { id: 'payout' });
    } catch (error) {
      toast.error('Failed to process payout request', { id: 'payout' });
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchQuery === '' || 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customer?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'expense': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case 'refund': return <RefreshCw className="w-4 h-4 text-orange-600" />;
      case 'commission': return <PieChart className="w-4 h-4 text-purple-600" />;
      default: return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600">Track revenue, expenses, and manage payouts</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => exportFinancialReport('pdf')}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => exportFinancialReport('excel')}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Excel</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Financial Stats Cards */}
      {financialStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(financialStats.totalRevenue)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    +{financialStats.monthlyGrowth}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(financialStats.netProfit)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  After expenses & commissions
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Available Balance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(financialStats.availableBalance)}
                </p>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={requestPayout}
                  disabled={financialStats.availableBalance <= 0}
                >
                  Request Payout
                </Button>
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Transaction</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(financialStats.avgTransactionValue)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Per booking
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-500">
                <Receipt className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Profit Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.8}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.8}
                name="Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Categories */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Categories</h3>
          <div className="space-y-4">
            {[
              { category: 'Services', amount: 8450, percentage: 68, color: 'bg-blue-500' },
              { category: 'Products', amount: 2340, percentage: 19, color: 'bg-green-500' },
              { category: 'Commissions', amount: -890, percentage: 7, color: 'bg-red-500' },
              { category: 'Other', amount: 740, percentage: 6, color: 'bg-yellow-500' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn('w-4 h-4 rounded', item.color)}></div>
                  <span className="text-sm font-medium text-gray-900">{item.category}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={cn('h-2 rounded-full', item.color)}
                      style={{ width: `${Math.abs(item.percentage)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                    {formatCurrency(Math.abs(item.amount))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="commission">Commission</option>
                <option value="refund">Refund</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Description</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Status</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-900">Amount</th>
                <th className="text-center py-3 px-6 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(transaction.type)}
                      <span className="capitalize text-sm font-medium text-gray-900">
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {transaction.customer ? (
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.customer.name}</p>
                        <p className="text-sm text-gray-500">{transaction.customer.email}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">
                      {formatDate(transaction.date)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(transaction.status)
                    )}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className={cn(
                      'text-sm font-semibold',
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Requests */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Requests</h3>
        <div className="space-y-4">
          {payoutRequests.map((payout) => (
            <div key={payout._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  payout.status === 'completed' ? 'bg-green-100' :
                  payout.status === 'pending' ? 'bg-yellow-100' :
                  payout.status === 'processing' ? 'bg-blue-100' : 'bg-red-100'
                )}>
                  {payout.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : payout.status === 'pending' ? (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  ) : payout.status === 'processing' ? (
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {formatCurrency(payout.amount)} to {payout.bankAccount}
                  </p>
                  <p className="text-sm text-gray-500">
                    Requested {formatDate(payout.requestedAt)}
                    {payout.processedAt && ` • Processed ${formatDate(payout.processedAt)}`}
                  </p>
                </div>
              </div>
              <span className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                getStatusColor(payout.status)
              )}>
                {payout.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}