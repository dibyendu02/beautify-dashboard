'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Star,
  Clock,
  Download,
  RefreshCw,
  Eye,
  Heart,
  Zap,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalBookings: number;
    averageRating: number;
    conversionRate: number;
    revenueGrowth: number;
    bookingGrowth: number;
  };
  revenueData: Array<{
    date: string;
    revenue: number;
    bookings: number;
    avgBookingValue: number;
  }>;
  servicePerformance: Array<{
    name: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
  customerSegments: Array<{
    segment: string;
    customers: number;
    revenue: number;
    color: string;
  }>;
  peakHours: Array<{
    hour: number;
    bookings: number;
  }>;
  conversionFunnel: Array<{
    stage: string;
    users: number;
    rate: number;
  }>;
  revenueByService: Array<{
    name: string;
    revenue: number;
    percentage: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  paymentMethods: Array<{
    method: string;
    amount: number;
    transactions: number;
    color: string;
  }>;
  performanceMetrics: {
    avgServiceTime: number;
    customerRetention: number;
    noShowRate: number;
    repeatBookingRate: number;
    avgWaitTime: number;
    staffUtilization: number;
  };
  staffPerformance: Array<{
    name: string;
    bookings: number;
    revenue: number;
    rating: number;
    utilization: number;
  }>;
  weeklyPerformance: Array<{
    day: string;
    bookings: number;
    revenue: number;
    efficiency: number;
  }>;
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function MerchantAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  useEffect(() => {
    setData({
      overview: {
        totalRevenue: 45678.90,
        totalBookings: 342,
        averageRating: 4.8,
        conversionRate: 12.5,
        revenueGrowth: 18.3,
        bookingGrowth: 24.7,
      },
      revenueData: [
        { date: '2024-01-01', revenue: 3200, bookings: 28, avgBookingValue: 114.29 },
        { date: '2024-01-02', revenue: 2850, bookings: 25, avgBookingValue: 114.00 },
        { date: '2024-01-03', revenue: 4100, bookings: 35, avgBookingValue: 117.14 },
        { date: '2024-01-04', revenue: 3750, bookings: 32, avgBookingValue: 117.19 },
        { date: '2024-01-05', revenue: 4500, bookings: 38, avgBookingValue: 118.42 },
        { date: '2024-01-06', revenue: 5200, bookings: 42, avgBookingValue: 123.81 },
        { date: '2024-01-07', revenue: 4800, bookings: 40, avgBookingValue: 120.00 },
      ],
      servicePerformance: [
        { name: 'Hair Cut & Style', bookings: 89, revenue: 8900, rating: 4.9 },
        { name: 'Facial Treatment', bookings: 67, revenue: 9380, rating: 4.8 },
        { name: 'Manicure & Pedicure', bookings: 54, revenue: 4320, rating: 4.7 },
        { name: 'Hair Coloring', bookings: 43, revenue: 8600, rating: 4.9 },
        { name: 'Massage Therapy', bookings: 38, revenue: 5700, rating: 4.8 },
      ],
      customerSegments: [
        { segment: 'New Customers', customers: 125, revenue: 15000, color: '#8b5cf6' },
        { segment: 'Returning Customers', customers: 167, revenue: 25000, color: '#06b6d4' },
        { segment: 'VIP Customers', customers: 23, revenue: 12000, color: '#10b981' },
        { segment: 'Inactive Customers', customers: 89, revenue: 0, color: '#9ca3af' },
      ],
      peakHours: [
        { hour: 9, bookings: 12 },
        { hour: 10, bookings: 18 },
        { hour: 11, bookings: 25 },
        { hour: 12, bookings: 15 },
        { hour: 13, bookings: 22 },
        { hour: 14, bookings: 28 },
        { hour: 15, bookings: 32 },
        { hour: 16, bookings: 30 },
        { hour: 17, bookings: 26 },
        { hour: 18, bookings: 20 },
      ],
      conversionFunnel: [
        { stage: 'Profile Views', users: 2500, rate: 100 },
        { stage: 'Service Views', users: 1250, rate: 50 },
        { stage: 'Booking Started', users: 500, rate: 20 },
        { stage: 'Booking Completed', users: 312, rate: 12.5 },
        { stage: 'Payment Completed', users: 298, rate: 11.9 },
      ],
      revenueByService: [
        { name: 'Hair Cut & Style', revenue: 8900, percentage: 24.5 },
        { name: 'Facial Treatment', revenue: 9380, percentage: 25.8 },
        { name: 'Manicure & Pedicure', revenue: 4320, percentage: 11.9 },
        { name: 'Hair Coloring', revenue: 8600, percentage: 23.7 },
        { name: 'Massage Therapy', revenue: 5120, percentage: 14.1 },
      ],
      revenueByMonth: [
        { month: 'Aug', revenue: 32500, expenses: 12000, profit: 20500 },
        { month: 'Sep', revenue: 38200, expenses: 14500, profit: 23700 },
        { month: 'Oct', revenue: 41800, expenses: 15200, profit: 26600 },
        { month: 'Nov', revenue: 39500, expenses: 14800, profit: 24700 },
        { month: 'Dec', revenue: 48900, expenses: 17500, profit: 31400 },
        { month: 'Jan', revenue: 45678, expenses: 16200, profit: 29478 },
      ],
      paymentMethods: [
        { method: 'Credit Card', amount: 28500, transactions: 186, color: '#8b5cf6' },
        { method: 'Debit Card', amount: 9800, transactions: 89, color: '#06b6d4' },
        { method: 'Cash', amount: 4200, transactions: 45, color: '#10b981' },
        { method: 'Digital Wallet', amount: 3178, transactions: 22, color: '#f59e0b' },
      ],
      performanceMetrics: {
        avgServiceTime: 45,
        customerRetention: 72.5,
        noShowRate: 4.2,
        repeatBookingRate: 68.3,
        avgWaitTime: 8,
        staffUtilization: 78.5,
      },
      staffPerformance: [
        { name: 'Emma Wilson', bookings: 98, revenue: 12500, rating: 4.9, utilization: 85 },
        { name: 'Sarah Johnson', bookings: 87, revenue: 10800, rating: 4.8, utilization: 78 },
        { name: 'Maria Garcia', bookings: 76, revenue: 9400, rating: 4.7, utilization: 72 },
        { name: 'Lisa Chen', bookings: 81, revenue: 9978, rating: 4.9, utilization: 76 },
      ],
      weeklyPerformance: [
        { day: 'Mon', bookings: 42, revenue: 5200, efficiency: 75 },
        { day: 'Tue', bookings: 48, revenue: 6100, efficiency: 82 },
        { day: 'Wed', bookings: 52, revenue: 6800, efficiency: 85 },
        { day: 'Thu', bookings: 55, revenue: 7200, efficiency: 88 },
        { day: 'Fri', bookings: 68, revenue: 8900, efficiency: 92 },
        { day: 'Sat', bookings: 72, revenue: 9500, efficiency: 95 },
        { day: 'Sun', bookings: 25, revenue: 3200, efficiency: 65 },
      ],
    });
  }, [timeRange]);

  const refreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const exportData = () => {
    // Implement export functionality
    console.log('Exporting analytics data...');
  };

  if (!data) return <div className="p-6">Loading analytics...</div>;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'revenue', name: 'Revenue', icon: DollarSign },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'performance', name: 'Performance', icon: Zap },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your business performance</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(data.overview.totalRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">
              +{data.overview.revenueGrowth}%
            </span>
            <span className="text-sm text-gray-600 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.overview.totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">
              +{data.overview.bookingGrowth}%
            </span>
            <span className="text-sm text-gray-600 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.overview.averageRating}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'w-4 h-4',
                    star <= data.overview.averageRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.overview.conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">+2.3%</span>
            <span className="text-sm text-gray-600 ml-1">vs last period</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Revenue Trend */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Bookings Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={data.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      fill="#8b5cf6"
                      fillOpacity={0.1}
                      stroke="#8b5cf6"
                    />
                    <Bar yAxisId="right" dataKey="bookings" fill="#06b6d4" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Service Performance & Peak Hours */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Services</h3>
                  <div className="space-y-4">
                    {data.servicePerformance.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-600">{service.bookings} bookings</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(service.revenue)}</p>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm text-gray-600">{service.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data.peakHours}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-8">
              {/* Customer Segments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.customerSegments}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ segment, customers }: any) => `${segment}: ${customers}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="customers"
                      >
                        {data.customerSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
                  <div className="space-y-4">
                    {data.conversionFunnel.map((stage, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-32 text-sm font-medium text-gray-700">{stage.stage}</div>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-purple-600 h-3 rounded-full"
                              style={{ width: `${stage.rate}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-20 text-right">
                          <span className="text-sm font-medium text-gray-900">{stage.users}</span>
                          <span className="text-xs text-gray-500 ml-1">({stage.rate}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-8">
              {/* Revenue by Month Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue, Expenses & Profit</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={data.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Profit" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue by Service & Payment Methods */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Service</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.revenueByService}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }: any) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {data.revenueByService.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                  <div className="space-y-4">
                    {data.paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: method.color }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">{method.method}</p>
                            <p className="text-sm text-gray-600">{method.transactions} transactions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(method.amount)}</p>
                          <p className="text-sm text-gray-500">
                            {((method.amount / data.paymentMethods.reduce((acc, m) => acc + m.amount, 0)) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Daily Revenue Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={data.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="avgBookingValue" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-8">
              {/* Performance Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{data.performanceMetrics.avgServiceTime}m</p>
                  <p className="text-xs text-gray-600">Avg Service Time</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{data.performanceMetrics.customerRetention}%</p>
                  <p className="text-xs text-gray-600">Customer Retention</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <TrendingDown className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{data.performanceMetrics.noShowRate}%</p>
                  <p className="text-xs text-gray-600">No-Show Rate</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <Heart className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{data.performanceMetrics.repeatBookingRate}%</p>
                  <p className="text-xs text-gray-600">Repeat Bookings</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{data.performanceMetrics.avgWaitTime}m</p>
                  <p className="text-xs text-gray-600">Avg Wait Time</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4 text-center">
                  <Zap className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-cyan-600">{data.performanceMetrics.staffUtilization}%</p>
                  <p className="text-xs text-gray-600">Staff Utilization</p>
                </div>
              </div>

              {/* Weekly Performance & Staff Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={data.weeklyPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="bookings" fill="#8b5cf6" name="Bookings" />
                      <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} name="Efficiency %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Performance</h3>
                  <div className="space-y-4">
                    {data.staffPerformance.map((staff, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-purple-600 font-semibold">
                                {staff.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{staff.name}</p>
                              <p className="text-sm text-gray-600">{staff.bookings} bookings</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(staff.revenue)}</p>
                            <div className="flex items-center justify-end">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm text-gray-600">{staff.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Utilization</span>
                            <span>{staff.utilization}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${staff.utilization}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}