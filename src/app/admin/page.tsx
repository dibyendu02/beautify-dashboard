'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminAnalytics from '@/components/enhanced/AdminAnalytics';
import EnhancedDataTable from '@/components/enhanced/EnhancedDataTable';
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
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(false);
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 12547,
      totalMerchants: 485,
      totalBookings: 8924,
      totalRevenue: 297500,
      monthlyGrowth: {
        users: 15.3,
        merchants: 8.7,
        bookings: 23.1,
        revenue: 18.9,
      }
    },
    systemHealth: {
      uptime: 99.9,
      responseTime: 145,
      errorRate: 0.02,
      activeConnections: 1247,
    },
    recentActivities: [
      {
        id: '1',
        user: 'Sarah Johnson',
        action: 'registered as a new merchant',
        status: 'success',
        time: '5 minutes ago'
      },
      {
        id: '2',
        user: 'Michael Chen',
        action: 'completed booking verification',
        status: 'success',
        time: '12 minutes ago'
      },
      {
        id: '3',
        user: 'Emma Davis',
        action: 'updated payment settings',
        status: 'warning',
        time: '25 minutes ago'
      },
      {
        id: '4',
        user: 'David Wilson',
        action: 'submitted dispute claim',
        status: 'pending',
        time: '1 hour ago'
      },
      {
        id: '5',
        user: 'Lisa Anderson',
        action: 'cancelled subscription',
        status: 'error',
        time: '2 hours ago'
      }
    ],
    topMerchants: [
      {
        id: '1',
        businessName: 'Glamour Beauty Studio',
        name: 'Glamour Beauty Studio',
        user: { firstName: 'Sarah', lastName: 'Johnson' },
        analytics: { totalRevenue: 25000, totalBookings: 150 }
      },
      {
        id: '2',
        businessName: 'Elite Hair Salon',
        name: 'Elite Hair Salon',
        user: { firstName: 'Michael', lastName: 'Chen' },
        analytics: { totalRevenue: 18500, totalBookings: 120 }
      },
      {
        id: '3',
        businessName: 'Zen Spa & Wellness',
        name: 'Zen Spa & Wellness',
        user: { firstName: 'Emma', lastName: 'Davis' },
        analytics: { totalRevenue: 22000, totalBookings: 95 }
      },
      {
        id: '4',
        businessName: 'Perfect Nails Studio',
        name: 'Perfect Nails Studio',
        user: { firstName: 'Lisa', lastName: 'Wilson' },
        analytics: { totalRevenue: 16000, totalBookings: 180 }
      },
      {
        id: '5',
        businessName: 'Radiant Skin Clinic',
        name: 'Radiant Skin Clinic',
        user: { firstName: 'David', lastName: 'Anderson' },
        analytics: { totalRevenue: 31000, totalBookings: 75 }
      }
    ]
  });

  // Load demo dashboard data
  useEffect(() => {
    const loadDemoData = () => {
      setLoading(true);
      
      // Simulate loading delay
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    loadDemoData();
  }, [timeframe]);

  const statsCards = [
    {
      title: 'Total Users',
      value: dashboardData.stats.totalUsers.toLocaleString(),
      change: dashboardData.stats.monthlyGrowth.users,
      icon: Users,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      darkColor: 'text-blue-600',
    },
    {
      title: 'Active Merchants',
      value: dashboardData.stats.totalMerchants.toLocaleString(),
      change: dashboardData.stats.monthlyGrowth.merchants,
      icon: Store,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      darkColor: 'text-green-600',
    },
    {
      title: 'Total Bookings',
      value: dashboardData.stats.totalBookings.toLocaleString(),
      change: dashboardData.stats.monthlyGrowth.bookings,
      icon: Calendar,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      darkColor: 'text-purple-600',
    },
    {
      title: 'Platform Revenue',
      value: formatCurrency(dashboardData.stats.totalRevenue),
      change: dashboardData.stats.monthlyGrowth.revenue,
      icon: DollarSign,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      darkColor: 'text-indigo-600',
    },
  ];

  const systemMetrics = [
    {
      label: 'System Uptime',
      value: `${dashboardData.systemHealth.uptime}%`,
      status: 'excellent',
      icon: Server,
    },
    {
      label: 'Response Time',
      value: `${dashboardData.systemHealth.responseTime}ms`,
      status: 'good',
      icon: Zap,
    },
    {
      label: 'Error Rate',
      value: `${dashboardData.systemHealth.errorRate}%`,
      status: 'excellent',
      icon: Shield,
    },
    {
      label: 'Active Sessions',
      value: dashboardData.systemHealth.activeConnections.toLocaleString(),
      status: 'normal',
      icon: Globe,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'pending':
        return 'text-blue-600';
      default:
        return 'text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertTriangle;
      case 'pending':
        return Clock;
      default:
        return Activity;
    }
  };

  const getSystemStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  // Demo data for merchants table
  const merchantsData = [
    {
      id: '1',
      name: 'Glamour Beauty Studio',
      owner: 'Sarah Johnson',
      revenue: formatCurrency(25000),
      bookings: 150,
      rating: 4.8,
      status: 'active'
    },
    {
      id: '2',
      name: 'Elite Hair Salon',
      owner: 'Michael Chen',
      revenue: formatCurrency(18500),
      bookings: 120,
      rating: 4.6,
      status: 'active'
    },
    {
      id: '3',
      name: 'Zen Spa & Wellness',
      owner: 'Emma Davis',
      revenue: formatCurrency(22000),
      bookings: 95,
      rating: 4.9,
      status: 'active'
    },
    {
      id: '4',
      name: 'Perfect Nails Studio',
      owner: 'Lisa Wilson',
      revenue: formatCurrency(16000),
      bookings: 180,
      rating: 4.7,
      status: 'pending'
    },
    {
      id: '5',
      name: 'Radiant Skin Clinic',
      owner: 'David Anderson',
      revenue: formatCurrency(31000),
      bookings: 75,
      rating: 4.9,
      status: 'active'
    }
  ];

  const merchantsColumns = [
    { key: 'name', label: 'Business Name', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'revenue', label: 'Revenue', sortable: true },
    { key: 'bookings', label: 'Bookings', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Content Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
            <p className="text-slate-600 mt-1">
              Welcome back, {user?.firstName}! Here&apos;s what&apos;s happening on your platform.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                    <div className="w-16 h-4 bg-slate-200 rounded"></div>
                  </div>
                  <div className="w-20 h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="w-24 h-8 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            statsCards.map((stat, index) => {
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
          })
          )}
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">System Health</h2>
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              All Systems Operational
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-slate-400 mr-2" />
                    <span className="text-sm font-medium text-slate-600">{metric.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</p>
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    getSystemStatusColor(metric.status)
                  )}>
                    {metric.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
              <Link href="/admin/activity">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity) => {
                const StatusIcon = getStatusIcon(activity.status);
                return (
                  <div key={activity.id} className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <StatusIcon className={cn('w-5 h-5', getStatusColor(activity.status))} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performing Merchants */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Top Performing Merchants</h2>
              <Link href="/admin/merchants">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData.topMerchants.map((merchant, index) => (
                <div key={merchant.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{merchant.businessName || merchant.name}</p>
                      <p className="text-sm text-slate-600">{merchant.user?.firstName} {merchant.user?.lastName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{formatCurrency(merchant.analytics?.totalRevenue || 0)}</p>
                    <p className="text-sm text-slate-600">{merchant.analytics?.totalBookings || 0} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/merchants/applications">
              <div className="p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
                  <UserCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Review Applications</h3>
                <p className="text-sm text-slate-600 mt-1">Approve pending merchant applications</p>
              </div>
            </Link>

            <Link href="/admin/users">
              <div className="p-4 border border-slate-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Manage Users</h3>
                <p className="text-sm text-slate-600 mt-1">View and manage platform users</p>
              </div>
            </Link>

            <Link href="/admin/analytics">
              <div className="p-4 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Platform Analytics</h3>
                <p className="text-sm text-slate-600 mt-1">View detailed analytics and insights</p>
              </div>
            </Link>

            <Link href="/admin/settings">
              <div className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-slate-200 transition-colors">
                  <Shield className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-900">System Settings</h3>
                <p className="text-sm text-slate-600 mt-1">Configure platform settings</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Enhanced Analytics Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Advanced Analytics</h2>
            <Link href="/admin/analytics">
              <Button variant="ghost" size="sm">
                View Full Analytics
              </Button>
            </Link>
          </div>
          <AdminAnalytics />
        </div>

        {/* Enhanced Data Table for Merchants */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Merchant Management</h2>
            <Link href="/admin/merchants">
              <Button variant="ghost" size="sm">
                Manage All Merchants
              </Button>
            </Link>
          </div>
          <EnhancedDataTable
            data={merchantsData}
            columns={merchantsColumns}
            searchable={true}
            actionsConfig={{
              view: true,
              edit: true,
              delete: true,
            }}
            onAction={(action: string, item: any) => {
              console.log('Action:', action, 'Item:', item);
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}