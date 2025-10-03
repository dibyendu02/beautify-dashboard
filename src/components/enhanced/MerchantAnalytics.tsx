'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
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
  Filter,
  Download,
  RefreshCw,
  Eye,
  Heart,
  MessageCircle,
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
                        label={({ segment, customers }) => `${segment}: ${customers}`}
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
        </div>
      </div>
    </div>
  );
}