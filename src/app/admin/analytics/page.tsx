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
        { month: 'Jan', revenue: 12450, bookings: 156 },
        { month: 'Feb', revenue: 15620, bookings: 189 },
        { month: 'Mar', revenue: 18930, bookings: 234 },
        { month: 'Apr', revenue: 22100, bookings: 278 },
        { month: 'May', revenue: 19800, bookings: 245 },
        { month: 'Jun', revenue: 25300, bookings: 312 },
        { month: 'Jul', revenue: 28450, bookings: 345 },
        { month: 'Aug', revenue: 31200, bookings: 389 },
        { month: 'Sep', revenue: 29800, bookings: 367 },
        { month: 'Oct', revenue: 33500, bookings: 412 },
        { month: 'Nov', revenue: 36200, bookings: 456 },
        { month: 'Dec', revenue: 41250, bookings: 523 },
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
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Revenue Trends</h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant={chartView === 'revenue' ? 'outline' : 'ghost'} 
                size="sm"
                onClick={() => setChartView('revenue')}
              >
                <LineChart className="w-4 h-4 mr-2" />
                Revenue
              </Button>
              <Button 
                variant={chartView === 'bookings' ? 'outline' : 'ghost'} 
                size="sm"
                onClick={() => setChartView('bookings')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Bookings
              </Button>
            </div>
          </div>
          
          {/* Interactive Chart */}
          <div className="h-80 relative">
            {chartView === 'revenue' ? (
              /* Revenue Line Chart */
              <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
                {/* Grid Lines */}
                <defs>
                  <pattern id="grid" width="66.67" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 66.67 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                  </pattern>
                  <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05"/>
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {analytics.revenueByMonth.length > 0 && (
                  <>
                    {/* Revenue Area */}
                    <path
                      d={analytics.revenueByMonth.map((point, index) => {
                        const x = (index / (analytics.revenueByMonth.length - 1)) * 800;
                        const maxRevenue = Math.max(...analytics.revenueByMonth.map(p => p.revenue));
                        const y = 320 - ((point.revenue / maxRevenue) * 280) - 20;
                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ') + ' L 800 320 L 0 320 Z'}
                      fill="url(#revenueGradient)"
                    />
                    
                    {/* Revenue Line */}
                    <path
                      d={analytics.revenueByMonth.map((point, index) => {
                        const x = (index / (analytics.revenueByMonth.length - 1)) * 800;
                        const maxRevenue = Math.max(...analytics.revenueByMonth.map(p => p.revenue));
                        const y = 320 - ((point.revenue / maxRevenue) * 280) - 20;
                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Data Points */}
                    {analytics.revenueByMonth.map((point, index) => {
                      const x = (index / (analytics.revenueByMonth.length - 1)) * 800;
                      const maxRevenue = Math.max(...analytics.revenueByMonth.map(p => p.revenue));
                      const y = 320 - ((point.revenue / maxRevenue) * 280) - 20;
                      return (
                        <g key={`revenue-point-${index}`}>
                          <circle
                            cx={x}
                            cy={y}
                            r="6"
                            fill="#ec4899"
                            stroke="#fff"
                            strokeWidth="3"
                            className="hover:r-8 transition-all cursor-pointer drop-shadow-lg"
                          />
                          <text
                            x={x}
                            y={y - 15}
                            textAnchor="middle"
                            className="text-xs font-medium fill-slate-700 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            {formatCurrency(point.revenue)}
                          </text>
                        </g>
                      );
                    })}
                  </>
                )}
              </svg>
            ) : (
              /* Bookings Bar Chart */
              <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="66.67" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 66.67 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                  </pattern>
                  <linearGradient id="bookingsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {analytics.revenueByMonth.length > 0 && (
                  <>
                    {/* Booking Bars */}
                    {analytics.revenueByMonth.map((point, index) => {
                      const barWidth = 800 / analytics.revenueByMonth.length * 0.6;
                      const x = (index / (analytics.revenueByMonth.length - 1)) * 800 - barWidth / 2;
                      const maxBookings = Math.max(...analytics.revenueByMonth.map(p => p.bookings));
                      const barHeight = (point.bookings / maxBookings) * 280;
                      const y = 320 - barHeight - 20;
                      
                      return (
                        <g key={`booking-bar-${index}`}>
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            fill="url(#bookingsGradient)"
                            stroke="#3b82f6"
                            strokeWidth="1"
                            rx="4"
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                          <text
                            x={x + barWidth / 2}
                            y={y - 5}
                            textAnchor="middle"
                            className="text-xs font-medium fill-slate-700"
                          >
                            {point.bookings}
                          </text>
                        </g>
                      );
                    })}
                  </>
                )}
              </svg>
            )}
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500 mt-2 px-4">
              {analytics.revenueByMonth.map((point, index) => (
                <span key={index} className="text-center">
                  {point.month}
                </span>
              ))}
            </div>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 -ml-16 py-4">
              {chartView === 'revenue' ? (
                <>
                  <span>{formatCurrency(Math.max(...analytics.revenueByMonth.map(p => p.revenue)))}</span>
                  <span>{formatCurrency(Math.max(...analytics.revenueByMonth.map(p => p.revenue)) * 0.75)}</span>
                  <span>{formatCurrency(Math.max(...analytics.revenueByMonth.map(p => p.revenue)) * 0.5)}</span>
                  <span>{formatCurrency(Math.max(...analytics.revenueByMonth.map(p => p.revenue)) * 0.25)}</span>
                  <span>$0</span>
                </>
              ) : (
                <>
                  <span>{Math.max(...analytics.revenueByMonth.map(p => p.bookings))}</span>
                  <span>{Math.round(Math.max(...analytics.revenueByMonth.map(p => p.bookings)) * 0.75)}</span>
                  <span>{Math.round(Math.max(...analytics.revenueByMonth.map(p => p.bookings)) * 0.5)}</span>
                  <span>{Math.round(Math.max(...analytics.revenueByMonth.map(p => p.bookings)) * 0.25)}</span>
                  <span>0</span>
                </>
              )}
            </div>
          </div>
          
          {/* Chart Legend and Summary */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className={cn("w-4 h-0.5 mr-2", chartView === 'revenue' ? 'bg-pink-500' : 'bg-blue-500')}></div>
                <span className="text-sm text-slate-600">
                  {chartView === 'revenue' ? 'Monthly Revenue' : 'Monthly Bookings'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">
                {chartView === 'revenue' ? 'Total for Period' : 'Total Bookings'}
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {chartView === 'revenue' 
                  ? formatCurrency(analytics.revenueByMonth.reduce((sum, item) => sum + item.revenue, 0))
                  : analytics.revenueByMonth.reduce((sum, item) => sum + item.bookings, 0).toLocaleString()
                }
              </p>
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