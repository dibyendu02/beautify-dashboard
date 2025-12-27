'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Scissors,
  Loader2,
  Filter,
  MessageSquare,
  Package,
  BarChart3,
  Bell,
  Eye,
  Plus,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import ChatInterface from '@/components/chat/ChatInterface';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import MerchantAnalytics from '@/components/enhanced/MerchantAnalytics';

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalCustomers: number;
  averageRating: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalServices: number;
  monthlyGrowth: {
    bookings: number;
    revenue: number;
    customers: number;
    rating: number;
  };
}

interface Booking {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  service: {
    name: string;
  };
  scheduledDate: string;
  status: string;
  totalAmount: number;
}

interface UpcomingAppointment {
  _id: string;
  scheduledDate: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  service: {
    name: string;
    duration: number;
  };
}

const dateRanges = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: '1 year', value: '1y' },
];

// Demo data for the dashboard
const DEMO_DASHBOARD_STATS: DashboardStats = {
  totalBookings: 156,
  totalRevenue: 8750,
  totalCustomers: 89,
  averageRating: 4.8,
  pendingBookings: 12,
  completedBookings: 134,
  cancelledBookings: 10,
  totalServices: 15,
  monthlyGrowth: {
    bookings: 12.5,
    revenue: 18.3,
    customers: 8.7,
    rating: 2.1,
  },
};

const DEMO_RECENT_BOOKINGS: Booking[] = [
  {
    _id: '1',
    customer: { firstName: 'Sarah', lastName: 'Johnson' },
    service: { name: 'Hair Cut & Style' },
    scheduledDate: '2024-01-15T10:00:00Z',
    status: 'confirmed',
    totalAmount: 85,
  },
  {
    _id: '2',
    customer: { firstName: 'Emma', lastName: 'Davis' },
    service: { name: 'Facial Treatment' },
    scheduledDate: '2024-01-14T14:30:00Z',
    status: 'completed',
    totalAmount: 120,
  },
  {
    _id: '3',
    customer: { firstName: 'Lisa', lastName: 'Wilson' },
    service: { name: 'Manicure & Pedicure' },
    scheduledDate: '2024-01-14T11:15:00Z',
    status: 'pending',
    totalAmount: 65,
  },
  {
    _id: '4',
    customer: { firstName: 'Maria', lastName: 'Garcia' },
    service: { name: 'Hair Color' },
    scheduledDate: '2024-01-13T09:00:00Z',
    status: 'completed',
    totalAmount: 150,
  },
];

const DEMO_UPCOMING_APPOINTMENTS: UpcomingAppointment[] = [
  {
    _id: '1',
    scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    customer: { _id: '1', firstName: 'Anna', lastName: 'Smith' },
    service: { name: 'Hair Styling', duration: 60 },
  },
  {
    _id: '2',
    scheduledDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    customer: { _id: '2', firstName: 'Kate', lastName: 'Brown' },
    service: { name: 'Eyebrow Threading', duration: 30 },
  },
  {
    _id: '3',
    scheduledDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    customer: { _id: '3', firstName: 'Jennifer', lastName: 'Taylor' },
    service: { name: 'Deep Cleansing Facial', duration: 90 },
  },
];

const DEMO_REVENUE_DATA = [
  { date: 'Jan 8', revenue: 420 },
  { date: 'Jan 9', revenue: 380 },
  { date: 'Jan 10', revenue: 510 },
  { date: 'Jan 11', revenue: 290 },
  { date: 'Jan 12', revenue: 650 },
  { date: 'Jan 13', revenue: 480 },
  { date: 'Jan 14', revenue: 720 },
  { date: 'Jan 15', revenue: 590 },
];

const DEMO_LIVE_STATS = {
  todayBookings: 8,
  todayRevenue: 640,
  onlineCustomers: 24,
  pendingBookings: 5,
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>({ firstName: 'Isabella', lastName: 'Beauty' });
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(DEMO_DASHBOARD_STATS);
  const [recentBookings, setRecentBookings] = useState<Booking[]>(DEMO_RECENT_BOOKINGS);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>(DEMO_UPCOMING_APPOINTMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [revenueData, setRevenueData] = useState<any[]>(DEMO_REVENUE_DATA);
  const [showQuickChat, setShowQuickChat] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [liveStats, setLiveStats] = useState(DEMO_LIVE_STATS);

  useEffect(() => {
    // Simulate loading demo user data
    const userData = localStorage.getItem('merchantUser');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.log('Using demo user data');
      }
    }
  }, []);

  const stats = dashboardStats ? [
    {
      title: 'Total Bookings',
      value: dashboardStats.totalBookings || 0,
      change: dashboardStats.monthlyGrowth.bookings,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(dashboardStats.totalRevenue || 0),
      change: dashboardStats.monthlyGrowth.revenue,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Customers',
      value: dashboardStats.totalCustomers || 0,
      change: dashboardStats.monthlyGrowth.customers,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Average Rating',
      value: `${dashboardStats.averageRating || 0}`,
      change: dashboardStats.monthlyGrowth.rating,
      icon: Star,
      color: 'bg-yellow-500',
    },
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Demo dashboard - no loading or error states needed


  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Welcome header */}
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your beauty business today.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  {dateRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      Last {range.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="hidden lg:block">
                <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                  <div className="flex items-center space-x-2">
                    <Scissors className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Today's Schedule</p>
                      <p className="text-gray-600 text-sm">{Array.isArray(upcomingAppointments) ? upcomingAppointments.length : 0} appointments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={cn('p-3 rounded-lg text-white', stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.change > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    stat.change > 0 ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </span>
                <span className="text-sm text-gray-900 ml-1">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Stats Bar */}
        <div className="bg-blue-900 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Live Dashboard</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{liveStats.todayBookings}</p>
              <p className="text-sm opacity-90">Today's Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{formatCurrency(liveStats.todayRevenue)}</p>
              <p className="text-sm opacity-90">Today's Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{liveStats.pendingBookings}</p>
              <p className="text-sm opacity-90">Pending Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{liveStats.onlineCustomers}</p>
              <p className="text-sm opacity-90">Online Customers</p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
              <Link href="/merchant/bookings">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {!Array.isArray(upcomingAppointments) || upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-900 text-sm">No appointments today</p>
                </div>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedCustomer({
                        _id: appointment.customer._id,
                        name: `${appointment.customer.firstName} ${appointment.customer.lastName}`,
                      });
                      setShowQuickChat(true);
                    }}
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {appointment.customer.firstName} {appointment.customer.lastName}
                      </p>
                      <p className="text-sm text-gray-900">{appointment.service.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary-600">
                        {new Date(appointment.scheduledDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </p>
                      <p className="text-sm text-gray-900">{appointment.service.duration}min</p>
                      <MessageSquare className="w-4 h-4 text-gray-400 ml-2 inline" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <Link href="/merchant/analytics">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Analytics
                </Button>
              </Link>
            </div>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm">No revenue data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Link href="/merchant/analytics">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View More
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { icon: Calendar, text: 'New booking from Sarah Johnson', time: '5 min ago', color: 'text-blue-600 bg-blue-100' },
                { icon: DollarSign, text: 'Payment received: €85.00', time: '12 min ago', color: 'text-green-600 bg-green-100' },
                { icon: Star, text: 'New 5-star review from Mike Brown', time: '1 hour ago', color: 'text-yellow-600 bg-yellow-100' },
                { icon: Package, text: 'Product "Hair Serum" running low', time: '2 hours ago', color: 'text-orange-600 bg-orange-100' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={cn('p-2 rounded-full', activity.color)}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Performance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(dashboardStats?.totalRevenue || 0)}
                </p>
                <p className="text-sm text-gray-900">Total Revenue</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardStats?.totalCustomers || 0}
                </p>
                <p className="text-sm text-gray-900">Total Customers</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {dashboardStats?.completedBookings || 0}
                </p>
                <p className="text-sm text-gray-900">Completed Bookings</p>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              <Link href="/merchant/bookings">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-900">Customer</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-900">Service</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-900">Status</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {!Array.isArray(recentBookings) || recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No recent bookings
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <p className="font-medium text-gray-900">
                            {booking.customer.firstName} {booking.customer.lastName}
                          </p>
                        </td>
                        <td className="py-3 px-2">
                          <p className="text-gray-900">{booking.service.name}</p>
                        </td>
                        <td className="py-3 px-2">
                          <p className="text-gray-900">{formatDate(booking.scheduledDate)}</p>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                              getStatusColor(booking.status)
                            )}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(booking.totalAmount)}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <Link href="/merchant/services/new">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors">
                <Scissors className="w-5 h-5 text-primary-600" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Add Service</h4>
              <p className="text-xs text-gray-600 mt-1">Create new offering</p>
            </div>
          </Link>

          <Link href="/merchant/products/new">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Add Product</h4>
              <p className="text-xs text-gray-600 mt-1">Expand catalog</p>
            </div>
          </Link>

          <Link href="/merchant/bookings">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm">View Calendar</h4>
              <p className="text-xs text-gray-600 mt-1">Manage appointments</p>
            </div>
          </Link>

          <Link href="/merchant/customers">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Customers</h4>
              <p className="text-xs text-gray-600 mt-1">View profiles</p>
            </div>
          </Link>

          <Link href="/merchant/analytics">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Analytics</h4>
              <p className="text-xs text-gray-600 mt-1">Business insights</p>
            </div>
          </Link>

          <Link href="/merchant/messages">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Messages</h4>
              <p className="text-xs text-gray-600 mt-1">Customer chats</p>
            </div>
          </Link>
        </div>

        {/* Enhanced Analytics Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Analytics</h3>
            <Link href="/merchant/analytics">
              <Button variant="ghost" size="sm">
                View Full Analytics
              </Button>
            </Link>
          </div>
          <MerchantAnalytics />
        </div>
      </div>
    </div>
  );
}