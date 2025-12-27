'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AdminLayout from '@/components/layout/AdminLayout';
import { useApi } from '@/hooks/useApi';
import {
  Users,
  Store,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Server,
  Globe,
  Zap,
  BarChart3,
  UserCheck,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreVertical,
  Home,
  Settings,
  Database,
  FileText,
  Mail,
  Plus,
  Filter,
  Search,
  Download,
  UserX,
  UserPlus,
  Star,
  MapPin,
  Phone,
  Building,
  Crown,
  Ban,
  RefreshCw,
  PieChart,
  LineChart,
  Target,
  Percent,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import { cn, formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalBookings: number;
    totalUsers: number;
    totalMerchants: number;
    growth: {
      revenue: number;
      bookings: number;
      users: number;
      merchants: number;
    };
  };
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    bookings: number;
    hairSalon: number;
    spa: number;
    nailSalon: number;
    medical: number;
    barbershop: number;
  }>;
  topPerformingMerchants: Array<{
    id: string;
    name: string;
    revenue: number;
    bookings: number;
    rating: number;
  }>;
  serviceCategories: Array<{
    category: string;
    bookings: number;
    revenue: number;
    percentage: number;
  }>;
  userEngagement: {
    dailyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    retentionRate: number;
  };
  conversionMetrics: {
    signupToBooking: number;
    bookingCompletion: number;
    repeatCustomerRate: number;
    averageBookingValue: number;
  };
}

export default function AnalyticsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [timeframe, setTimeframe] = useState('30d');
  const [chartView, setChartView] = useState<'revenue' | 'bookings'>('revenue');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    overview: {
      totalRevenue: 0,
      totalBookings: 0,
      totalUsers: 0,
      totalMerchants: 0,
      growth: {
        revenue: 0,
        bookings: 0,
        users: 0,
        merchants: 0,
      },
    },
    revenueByMonth: [],
    topPerformingMerchants: [],
    serviceCategories: [],
    userEngagement: {
      dailyActiveUsers: 0,
      monthlyActiveUsers: 0,
      averageSessionDuration: 0,
      retentionRate: 0,
    },
    conversionMetrics: {
      signupToBooking: 0,
      bookingCompletion: 0,
      repeatCustomerRate: 0,
      averageBookingValue: 0,
    },
  });

  useEffect(() => {
    // Demo data - replace with API calls
    setAnalytics({
      overview: {
        totalRevenue: 145250.75,
        totalBookings: 1843,
        totalUsers: 2456,
        totalMerchants: 87,
        growth: {
          revenue: 15.2,
          bookings: 23.1,
          users: 12.8,
          merchants: 8.5,
        },
      },
      revenueByMonth: [
        { month: 'Jan', revenue: 12450, bookings: 156, hairSalon: 4350, spa: 3600, nailSalon: 2100, medical: 1800, barbershop: 600 },
        { month: 'Feb', revenue: 15620, bookings: 189, hairSalon: 5250, spa: 4600, nailSalon: 2800, medical: 2100, barbershop: 870 },
        { month: 'Mar', revenue: 18930, bookings: 234, hairSalon: 6400, spa: 5500, nailSalon: 3200, medical: 2500, barbershop: 1330 },
        { month: 'Apr', revenue: 22100, bookings: 278, hairSalon: 7500, spa: 6400, nailSalon: 3900, medical: 3000, barbershop: 1300 },
        { month: 'May', revenue: 19800, bookings: 245, hairSalon: 6800, spa: 5700, nailSalon: 3500, medical: 2700, barbershop: 1100 },
        { month: 'Jun', revenue: 25300, bookings: 312, hairSalon: 8500, spa: 7200, nailSalon: 4200, medical: 3500, barbershop: 1900 },
        { month: 'Jul', revenue: 28450, bookings: 345, hairSalon: 9600, spa: 8100, nailSalon: 4600, medical: 4000, barbershop: 2150 },
        { month: 'Aug', revenue: 31200, bookings: 389, hairSalon: 10500, spa: 8900, nailSalon: 5200, medical: 4400, barbershop: 2200 },
        { month: 'Sep', revenue: 29800, bookings: 367, hairSalon: 10100, spa: 8500, nailSalon: 4900, medical: 4200, barbershop: 2100 },
        { month: 'Oct', revenue: 33500, bookings: 412, hairSalon: 11300, spa: 9400, nailSalon: 5600, medical: 4700, barbershop: 2500 },
        { month: 'Nov', revenue: 36200, bookings: 456, hairSalon: 12200, spa: 10100, nailSalon: 6100, medical: 5300, barbershop: 2500 },
        { month: 'Dec', revenue: 41250, bookings: 523, hairSalon: 14000, spa: 11500, nailSalon: 7000, medical: 6200, barbershop: 2550 },
      ],
      topPerformingMerchants: [
        { id: '1', name: 'Luxe Spa & Wellness', revenue: 28750, bookings: 203, rating: 4.9 },
        { id: '2', name: 'Glow Aesthetic Center', revenue: 45200, bookings: 312, rating: 4.7 },
        { id: '3', name: 'Bella Beauty Salon', revenue: 15420, bookings: 156, rating: 4.8 },
        { id: '4', name: 'Elite Massage Therapy', revenue: 22100, bookings: 189, rating: 4.6 },
        { id: '5', name: 'Urban Hair Studio', revenue: 18650, bookings: 234, rating: 4.5 },
      ],
      serviceCategories: [
        { category: 'Hair Salon', bookings: 756, revenue: 65400, percentage: 35.2 },
        { category: 'Spa', bookings: 523, revenue: 89250, percentage: 28.4 },
        { category: 'Medical Spa', bookings: 234, revenue: 125600, percentage: 12.7 },
        { category: 'Nail Salon', bookings: 412, revenue: 28950, percentage: 22.4 },
        { category: 'Barbershop', bookings: 189, revenue: 12400, percentage: 10.3 },
      ],
      userEngagement: {
        dailyActiveUsers: 1245,
        monthlyActiveUsers: 8976,
        averageSessionDuration: 12.5,
        retentionRate: 68.2,
      },
      conversionMetrics: {
        signupToBooking: 42.5,
        bookingCompletion: 87.3,
        repeatCustomerRate: 34.8,
        averageBookingValue: 78.45,
      },
    });
  }, [timeframe]);

  const overviewCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(analytics.overview.totalRevenue),
      change: analytics.overview.growth.revenue,
      icon: DollarSign,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      darkColor: 'text-green-600',
    },
    {
      title: 'Total Bookings',
      value: analytics.overview.totalBookings.toLocaleString(),
      change: analytics.overview.growth.bookings,
      icon: Calendar,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      darkColor: 'text-blue-600',
    },
    {
      title: 'Platform Users',
      value: analytics.overview.totalUsers.toLocaleString(),
      change: analytics.overview.growth.users,
      icon: Users,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      darkColor: 'text-purple-600',
    },
    {
      title: 'Active Merchants',
      value: analytics.overview.totalMerchants.toLocaleString(),
      change: analytics.overview.growth.merchants,
      icon: Store,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      darkColor: 'text-indigo-600',
    },
  ];

  const engagementCards = [
    {
      title: 'Daily Active Users',
      value: analytics.userEngagement.dailyActiveUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Monthly Active Users',
      value: analytics.userEngagement.monthlyActiveUsers.toLocaleString(),
      icon: Activity,
      color: 'text-green-600',
    },
    {
      title: 'Avg Session Duration',
      value: `${analytics.userEngagement.averageSessionDuration}m`,
      icon: Clock,
      color: 'text-purple-600',
    },
    {
      title: 'User Retention',
      value: `${analytics.userEngagement.retentionRate}%`,
      icon: Target,
      color: 'text-orange-600',
    },
  ];

  const conversionCards = [
    {
      title: 'Signup to Booking',
      value: `${analytics.conversionMetrics.signupToBooking}%`,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Booking Completion',
      value: `${analytics.conversionMetrics.bookingCompletion}%`,
      icon: CheckCircle,
      color: 'text-blue-600',
    },
    {
      title: 'Repeat Customers',
      value: `${analytics.conversionMetrics.repeatCustomerRate}%`,
      icon: RefreshCw,
      color: 'text-purple-600',
    },
    {
      title: 'Avg Booking Value',
      value: formatCurrency(analytics.conversionMetrics.averageBookingValue),
      icon: DollarSign,
      color: 'text-orange-600',
    },
  ];

  const exportReport = () => {
    // Generate and download analytics report
    console.log('Exporting analytics report...');
  };

  const notifications = [
    {
      id: '1',
      title: 'Monthly Report Ready',
      message: 'November analytics report is available',
      time: '10 min ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Revenue Milestone',
      message: 'Platform crossed $100K monthly revenue',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: '3',
      title: 'User Growth Alert',
      message: '20% increase in new user signups',
      time: '1 day ago',
      unread: false,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Platform Analytics</h1>
            <p className="text-slate-600 mt-1">
              Comprehensive insights and performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <Button variant="outline" size="sm" onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('p-3 rounded-xl', stat.lightColor)}>
                    <Icon className={cn('w-6 h-6', stat.darkColor)} />
                  </div>
                  <div className="flex items-center text-sm">
                    {stat.change > 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={cn(
                        'font-medium',
                        stat.change > 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Area Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Monthly Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.revenueByMonth}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-pink-50 rounded-lg">
              <p className="text-sm text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(analytics.revenueByMonth.reduce((sum, item) => sum + item.revenue, 0))}
              </p>
            </div>
          </div>

          {/* Bookings Bar Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Monthly Bookings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-slate-600">Total Bookings</p>
              <p className="text-2xl font-bold text-slate-900">
                {analytics.revenueByMonth.reduce((sum, item) => sum + item.bookings, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Service Category Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Service Category Revenue Breakdown</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stacked Area by Category */}
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.revenueByMonth}>
                  <defs>
                    <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="spaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="nailGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="hairSalon" 
                    name="Hair Salon"
                    stackId="1"
                    stroke="#f97316" 
                    fill="url(#hairGrad)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="spa" 
                    name="Spa"
                    stackId="1"
                    stroke="#06b6d4" 
                    fill="url(#spaGrad)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="nailSalon" 
                    name="Nail Salon"
                    stackId="1"
                    stroke="#10b981" 
                    fill="url(#nailGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Pie Chart */}
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={analytics.serviceCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {[
                      { color: '#f97316' },
                      { color: '#06b6d4' },
                      { color: '#10b981' },
                      { color: '#8b5cf6' },
                      { color: '#ec4899' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Service Categories & Top Merchants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Categories */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Service Categories</h2>
            <div className="space-y-4">
              {analytics.serviceCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-900">{category.category}</span>
                      <span className="text-sm text-slate-600">{category.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-pink-500 h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{category.bookings} bookings</span>
                      <span>{formatCurrency(category.revenue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Merchants */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Top Performing Merchants</h2>
            <div className="space-y-4">
              {analytics.topPerformingMerchants.map((merchant, index) => (
                <div key={merchant.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{merchant.name}</p>
                      <div className="flex items-center text-sm text-slate-600">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        {merchant.rating}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{formatCurrency(merchant.revenue)}</p>
                    <p className="text-sm text-slate-600">{merchant.bookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Engagement Metrics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">User Engagement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagementCards.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-slate-100 rounded-xl">
                      <Icon className={cn('w-6 h-6', metric.color)} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-slate-600">{metric.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversion Metrics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Conversion Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {conversionCards.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-slate-100 rounded-xl">
                      <Icon className={cn('w-6 h-6', metric.color)} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-slate-600">{metric.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export and Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Export & Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start">
              <Download className="w-4 h-4 mr-2" />
              Revenue Report
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="w-4 h-4 mr-2" />
              User Analytics
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="w-4 h-4 mr-2" />
              Merchant Performance
            </Button>
            <Button variant="outline" className="justify-start">
              <PieChart className="w-4 h-4 mr-2" />
              Category Breakdown
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}