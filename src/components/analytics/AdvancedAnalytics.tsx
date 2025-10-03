'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
// Removed API imports - using demo data
import { formatCurrency, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    chartData: Array<{ date: string; revenue: number; bookings: number }>;
  };
  bookings: {
    total: number;
    growth: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  customers: {
    total: number;
    growth: number;
    new: number;
    returning: number;
  };
  services: {
    total: number;
    topPerforming: Array<{ name: string; bookings: number; revenue: number }>;
  };
  timeAnalysis: {
    peakHours: Array<{ hour: string; bookings: number }>;
    peakDays: Array<{ day: string; bookings: number }>;
  };
  rating: {
    average: number;
    total: number;
    distribution: Array<{ rating: number; count: number }>;
  };
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const dateRanges = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: '1 year', value: '1y' },
];

export default function AdvancedAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Generate demo analytics data
      const generateRevenueData = () => {
        const data = [];
        const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          data.push({
            date: date.toISOString().split('T')[0],
            revenue: Math.floor(Math.random() * 1000) + 300,
            bookings: Math.floor(Math.random() * 15) + 5,
          });
        }
        return data;
      };

      const demoData: AnalyticsData = {
        revenue: {
          total: 28750.50,
          growth: 12.4,
          chartData: generateRevenueData(),
        },
        bookings: {
          total: 342,
          growth: 8.7,
          completed: 298,
          cancelled: 23,
          pending: 21,
        },
        customers: {
          total: 187,
          growth: 15.2,
          new: 34,
          returning: 153,
        },
        services: {
          total: 8,
          topPerforming: [
            { name: 'Classic Facial Treatment', bookings: 156, revenue: 18720 },
            { name: 'Deep Tissue Massage', bookings: 98, revenue: 14700 },
            { name: 'Gel Manicure & Pedicure', bookings: 145, revenue: 12325 },
            { name: 'Hydrafacial Treatment', bookings: 67, revenue: 12060 },
            { name: 'Eyebrow Threading & Tinting', bookings: 89, revenue: 5785 },
          ],
        },
        timeAnalysis: {
          peakHours: [
            { hour: '10:00', bookings: 45 },
            { hour: '11:00', bookings: 52 },
            { hour: '14:00', bookings: 48 },
            { hour: '15:00', bookings: 56 },
            { hour: '16:00', bookings: 42 },
          ],
          peakDays: [
            { day: 'Monday', bookings: 58 },
            { day: 'Tuesday', bookings: 62 },
            { day: 'Wednesday', bookings: 71 },
            { day: 'Thursday', bookings: 68 },
            { day: 'Friday', bookings: 75 },
            { day: 'Saturday', bookings: 89 },
            { day: 'Sunday', bookings: 34 },
          ],
        },
        rating: {
          average: 4.7,
          total: 523,
          distribution: [
            { rating: '5 stars', count: 312, percentage: 59.7 },
            { rating: '4 stars', count: 156, percentage: 29.8 },
            { rating: '3 stars', count: 42, percentage: 8.0 },
            { rating: '2 stars', count: 9, percentage: 1.7 },
            { rating: '1 star', count: 4, percentage: 0.8 },
          ],
        },
      };

      setAnalyticsData(demoData);
    } catch (err: any) {
      console.error('Error loading analytics data:', err);
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnalyticsData = (data: any) => {
    // Update analytics data with real-time updates
    setAnalyticsData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        revenue: {
          ...prev.revenue,
          total: data.revenue?.total || prev.revenue.total,
        },
        bookings: {
          ...prev.bookings,
          total: data.bookings?.total || prev.bookings.total,
        },
        customers: {
          ...prev.customers,
          total: data.customers?.total || prev.customers.total,
        },
      };
    });
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadAnalyticsData();
    setIsRefreshing(false);
    toast.success('Analytics data refreshed');
  };

  const exportData = async () => {
    try {
      // This would be an API call to export analytics data
      toast.success('Analytics report exported successfully');
    } catch (error) {
      toast.error('Failed to export analytics report');
    }
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color, 
    trend 
  }: {
    title: string;
    value: string;
    change: number;
    icon: any;
    color: string;
    trend: 'up' | 'down' | 'neutral';
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {trend !== 'neutral' && (
              <>
                {trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend === 'up' ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </>
            )}
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
        <div className={cn('p-3 rounded-full', color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadAnalyticsData}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  Last {range.label}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="ghost"
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
            <span>Refresh</span>
          </Button>
          <Button onClick={exportData} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(analyticsData.revenue.total)}
            change={analyticsData.revenue.growth}
            icon={DollarSign}
            color="bg-green-500"
            trend={analyticsData.revenue.growth > 0 ? 'up' : analyticsData.revenue.growth < 0 ? 'down' : 'neutral'}
          />
          <MetricCard
            title="Total Bookings"
            value={analyticsData.bookings.total.toString()}
            change={analyticsData.bookings.growth}
            icon={Calendar}
            color="bg-blue-500"
            trend={analyticsData.bookings.growth > 0 ? 'up' : analyticsData.bookings.growth < 0 ? 'down' : 'neutral'}
          />
          <MetricCard
            title="Total Customers"
            value={analyticsData.customers.total.toString()}
            change={analyticsData.customers.growth}
            icon={Users}
            color="bg-purple-500"
            trend={analyticsData.customers.growth > 0 ? 'up' : analyticsData.customers.growth < 0 ? 'down' : 'neutral'}
          />
          <MetricCard
            title="Average Rating"
            value={analyticsData.rating.average.toFixed(1)}
            change={0} // Would need historical data for this
            icon={Star}
            color="bg-yellow-500"
            trend="neutral"
          />
        </div>
      )}

      {/* Charts */}
      {analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.revenue.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Booking Status Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: analyticsData.bookings.completed, color: '#10b981' },
                    { name: 'Pending', value: analyticsData.bookings.pending, color: '#f59e0b' },
                    { name: 'Cancelled', value: analyticsData.bookings.cancelled, color: '#ef4444' },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Completed', value: analyticsData.bookings.completed, color: '#10b981' },
                    { name: 'Pending', value: analyticsData.bookings.pending, color: '#f59e0b' },
                    { name: 'Cancelled', value: analyticsData.bookings.cancelled, color: '#ef4444' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Peak Hours */}
          {analyticsData.timeAnalysis.peakHours.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.timeAnalysis.peakHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Services */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Services</h3>
            <div className="space-y-4">
              {analyticsData.services.topPerforming.slice(0, 5).map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium',
                      COLORS[index % COLORS.length]
                    )} style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(service.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Additional Stats */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Customers</span>
                <span className="font-semibold text-gray-900">{analyticsData.customers.new}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Returning Customers</span>
                <span className="font-semibold text-gray-900">{analyticsData.customers.returning}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Retention Rate</span>
                <span className="font-semibold text-gray-900">
                  {analyticsData.customers.total > 0 
                    ? Math.round((analyticsData.customers.returning / analyticsData.customers.total) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Services</span>
                <span className="font-semibold text-gray-900">{analyticsData.services.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">{analyticsData.rating.average.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Reviews</span>
                <span className="font-semibold text-gray-900">{analyticsData.rating.total}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold text-gray-900">
                  {analyticsData.bookings.total > 0 
                    ? Math.round((analyticsData.bookings.completed / analyticsData.bookings.total) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cancellation Rate</span>
                <span className="font-semibold text-gray-900">
                  {analyticsData.bookings.total > 0 
                    ? Math.round((analyticsData.bookings.cancelled / analyticsData.bookings.total) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Revenue per Booking</span>
                <span className="font-semibold text-gray-900">
                  {analyticsData.bookings.completed > 0 
                    ? formatCurrency(analyticsData.revenue.total / analyticsData.bookings.completed)
                    : formatCurrency(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}