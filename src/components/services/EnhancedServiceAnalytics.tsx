'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Star,
  DollarSign,
  Clock,
  Users,
  Calendar,
  Eye,
  Target,
  Award,
  Activity,
  Zap,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Edit3,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Scissors,
  Heart,
  ThumbsUp,
  MessageSquare,
  XCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface Service {
  _id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  status: 'active' | 'inactive' | 'featured';
  createdAt: string;
  analytics: {
    totalBookings: number;
    revenue: number;
    averageRating: number;
    totalReviews: number;
    conversionRate: number;
    repeatCustomerRate: number;
    avgWaitTime: number;
    cancellationRate: number;
    profitMargin: number;
    seasonalTrend: 'up' | 'down' | 'stable';
    performanceScore: number;
  };
  trends: {
    bookings: Array<{ date: string; count: number }>;
    revenue: Array<{ date: string; amount: number }>;
    satisfaction: Array<{ date: string; rating: number }>;
  };
  demographics: {
    ageGroups: Array<{ group: string; count: number }>;
    genderSplit: Array<{ gender: string; count: number }>;
    loyaltyTiers: Array<{ tier: string; count: number }>;
  };
  competitiveAnalysis: {
    marketPosition: 'leader' | 'follower' | 'niche';
    priceCompetitiveness: number;
    uniqueSellingPoints: string[];
    improvementAreas: string[];
  };
}

interface ServicePerformanceMetrics {
  topPerformers: Service[];
  underperformers: Service[];
  totalRevenue: number;
  totalBookings: number;
  averageRating: number;
  categoryBreakdown: Array<{
    category: string;
    revenue: number;
    bookings: number;
    services: number;
  }>;
  seasonalTrends: Array<{
    month: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
  customerSatisfaction: {
    overall: number;
    byCategory: Array<{ category: string; rating: number }>;
    trends: Array<{ date: string; rating: number }>;
  };
}

const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function EnhancedServiceAnalytics() {
  const [services, setServices] = useState<Service[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<ServicePerformanceMetrics | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('revenue');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'comparison'>('overview');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    loadServiceAnalytics();
  }, [dateRange, categoryFilter]);

  const loadServiceAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Mock API calls - replace with actual API
      const [servicesRes, metricsRes] = await Promise.allSettled([
        fetch(`/api/services/analytics?period=${dateRange}&category=${categoryFilter}`).then(r => r.json()).catch(() => generateMockServices()),
        fetch(`/api/services/performance-metrics?period=${dateRange}`).then(r => r.json()).catch(() => generateMockMetrics()),
      ]);

      if (servicesRes.status === 'fulfilled') setServices(servicesRes.value);
      if (metricsRes.status === 'fulfilled') setPerformanceMetrics(metricsRes.value);

    } catch (error) {
      console.error('Error loading service analytics:', error);
      
      // Load mock data as fallback
      setServices(generateMockServices());
      setPerformanceMetrics(generateMockMetrics());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockServices = (): Service[] => [
    {
      _id: '1',
      name: 'Hair Styling & Cut',
      category: 'Hair',
      duration: 60,
      price: 85.00,
      status: 'active',
      createdAt: '2024-01-15T00:00:00Z',
      analytics: {
        totalBookings: 124,
        revenue: 10540.00,
        averageRating: 4.8,
        totalReviews: 89,
        conversionRate: 78.5,
        repeatCustomerRate: 65.2,
        avgWaitTime: 5.2,
        cancellationRate: 8.1,
        profitMargin: 72.3,
        seasonalTrend: 'up',
        performanceScore: 92,
      },
      trends: {
        bookings: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          count: Math.floor(Math.random() * 8) + 2,
        })).reverse(),
        revenue: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amount: Math.floor(Math.random() * 800) + 200,
        })).reverse(),
        satisfaction: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          rating: 4.2 + Math.random() * 0.8,
        })).reverse(),
      },
      demographics: {
        ageGroups: [
          { group: '18-25', count: 28 },
          { group: '26-35', count: 45 },
          { group: '36-45', count: 32 },
          { group: '46-55', count: 19 },
        ],
        genderSplit: [
          { gender: 'Female', count: 98 },
          { gender: 'Male', count: 26 },
        ],
        loyaltyTiers: [
          { tier: 'Bronze', count: 45 },
          { tier: 'Silver', count: 38 },
          { tier: 'Gold', count: 28 },
          { tier: 'Platinum', count: 13 },
        ],
      },
      competitiveAnalysis: {
        marketPosition: 'leader',
        priceCompetitiveness: 85.2,
        uniqueSellingPoints: ['Expert stylists', 'Premium products', 'Personalized consultation'],
        improvementAreas: ['Booking availability', 'Wait time reduction'],
      },
    },
    {
      _id: '2',
      name: 'Deep Cleansing Facial',
      category: 'Skincare',
      duration: 75,
      price: 120.00,
      status: 'featured',
      createdAt: '2024-02-01T00:00:00Z',
      analytics: {
        totalBookings: 89,
        revenue: 10680.00,
        averageRating: 4.9,
        totalReviews: 67,
        conversionRate: 82.1,
        repeatCustomerRate: 71.8,
        avgWaitTime: 3.8,
        cancellationRate: 5.6,
        profitMargin: 68.5,
        seasonalTrend: 'up',
        performanceScore: 95,
      },
      trends: {
        bookings: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          count: Math.floor(Math.random() * 6) + 1,
        })).reverse(),
        revenue: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amount: Math.floor(Math.random() * 600) + 300,
        })).reverse(),
        satisfaction: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          rating: 4.5 + Math.random() * 0.5,
        })).reverse(),
      },
      demographics: {
        ageGroups: [
          { group: '18-25', count: 15 },
          { group: '26-35', count: 35 },
          { group: '36-45', count: 25 },
          { group: '46-55', count: 14 },
        ],
        genderSplit: [
          { gender: 'Female', count: 78 },
          { gender: 'Male', count: 11 },
        ],
        loyaltyTiers: [
          { tier: 'Bronze', count: 22 },
          { tier: 'Silver', count: 28 },
          { tier: 'Gold', count: 25 },
          { tier: 'Platinum', count: 14 },
        ],
      },
      competitiveAnalysis: {
        marketPosition: 'leader',
        priceCompetitiveness: 92.1,
        uniqueSellingPoints: ['Medical-grade products', 'Customized treatment', 'Expert aestheticians'],
        improvementAreas: ['Package deals', 'Follow-up care'],
      },
    },
    {
      _id: '3',
      name: 'Classic Manicure',
      category: 'Nails',
      duration: 45,
      price: 35.00,
      status: 'active',
      createdAt: '2024-01-20T00:00:00Z',
      analytics: {
        totalBookings: 156,
        revenue: 5460.00,
        averageRating: 4.6,
        totalReviews: 112,
        conversionRate: 72.3,
        repeatCustomerRate: 58.9,
        avgWaitTime: 7.5,
        cancellationRate: 12.3,
        profitMargin: 65.8,
        seasonalTrend: 'stable',
        performanceScore: 78,
      },
      trends: {
        bookings: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          count: Math.floor(Math.random() * 8) + 3,
        })).reverse(),
        revenue: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amount: Math.floor(Math.random() * 400) + 100,
        })).reverse(),
        satisfaction: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          rating: 4.2 + Math.random() * 0.6,
        })).reverse(),
      },
      demographics: {
        ageGroups: [
          { group: '18-25', count: 42 },
          { group: '26-35', count: 58 },
          { group: '36-45', count: 35 },
          { group: '46-55', count: 21 },
        ],
        genderSplit: [
          { gender: 'Female', count: 148 },
          { gender: 'Male', count: 8 },
        ],
        loyaltyTiers: [
          { tier: 'Bronze', count: 68 },
          { tier: 'Silver', count: 45 },
          { tier: 'Gold', count: 28 },
          { tier: 'Platinum', count: 15 },
        ],
      },
      competitiveAnalysis: {
        marketPosition: 'follower',
        priceCompetitiveness: 78.5,
        uniqueSellingPoints: ['Quick service', 'Walk-ins welcome', 'Affordable pricing'],
        improvementAreas: ['Premium options', 'Nail art services', 'Loyalty rewards'],
      },
    },
  ];

  const generateMockMetrics = (): ServicePerformanceMetrics => ({
    topPerformers: [],
    underperformers: [],
    totalRevenue: 26680.00,
    totalBookings: 369,
    averageRating: 4.7,
    categoryBreakdown: [
      { category: 'Hair', revenue: 10540.00, bookings: 124, services: 3 },
      { category: 'Skincare', revenue: 10680.00, bookings: 89, services: 2 },
      { category: 'Nails', revenue: 5460.00, bookings: 156, services: 4 },
    ],
    seasonalTrends: [
      { month: 'Jun', bookings: 89, revenue: 7850, rating: 4.6 },
      { month: 'Jul', bookings: 102, revenue: 8920, rating: 4.7 },
      { month: 'Aug', bookings: 95, revenue: 8450, rating: 4.8 },
      { month: 'Sep', bookings: 83, revenue: 7460, rating: 4.7 },
    ],
    customerSatisfaction: {
      overall: 4.7,
      byCategory: [
        { category: 'Hair', rating: 4.8 },
        { category: 'Skincare', rating: 4.9 },
        { category: 'Nails', rating: 4.6 },
      ],
      trends: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        rating: 4.5 + Math.random() * 0.4,
      })).reverse(),
    },
  });

  const exportServiceData = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      toast.loading('Exporting service analytics...', { id: 'export' });
      
      // Mock export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Service analytics exported as ${format.toUpperCase()}`, { id: 'export' });
    } catch (error) {
      toast.error('Failed to export data', { id: 'export' });
    }
  };

  const optimizeService = async (serviceId: string) => {
    try {
      toast.loading('Analyzing service optimization...', { id: 'optimize' });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Service optimization recommendations generated', { id: 'optimize' });
    } catch (error) {
      toast.error('Failed to generate recommendations', { id: 'optimize' });
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceIcon = (score: number) => {
    if (score >= 90) return <Award className="w-4 h-4" />;
    if (score >= 80) return <TrendingUp className="w-4 h-4" />;
    if (score >= 70) return <Activity className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const sortedServices = [...services].sort((a, b) => {
    switch (sortBy) {
      case 'revenue': return b.analytics.revenue - a.analytics.revenue;
      case 'bookings': return b.analytics.totalBookings - a.analytics.totalBookings;
      case 'rating': return b.analytics.averageRating - a.analytics.averageRating;
      case 'performance': return b.analytics.performanceScore - a.analytics.performanceScore;
      default: return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Service Analytics</h1>
          <p className="text-gray-600">Comprehensive service performance analysis and optimization</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'detailed', label: 'Detailed', icon: Eye },
              { key: 'comparison', label: 'Compare', icon: Target },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setViewMode(key as any)}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  viewMode === key
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button
            onClick={() => exportServiceData('excel')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      {performanceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(performanceMetrics.totalRevenue)}
                </p>
                <p className="text-sm text-green-600 mt-2">+12.5% vs last period</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{performanceMetrics.totalBookings}</p>
                <p className="text-sm text-blue-600 mt-2">Across all services</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{performanceMetrics.averageRating}</p>
                <p className="text-sm text-yellow-600 mt-2">Customer satisfaction</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Top Performer</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {services.find(s => s.analytics.performanceScore === Math.max(...services.map(s => s.analytics.performanceScore)))?.name || 'N/A'}
                </p>
                <p className="text-sm text-purple-600 mt-2">Best overall score</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {viewMode === 'overview' && (
        <div className="space-y-6">
          {/* Category Breakdown */}
          {performanceMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceMetrics.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, revenue }: any) => `${category}: ${formatCurrency(revenue as number)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {performanceMetrics.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceMetrics.customerSatisfaction.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis domain={[4.0, 5.0]} fontSize={12} />
                    <Tooltip formatter={(value) => [Number(value).toFixed(1), 'Rating']} />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Services Performance Table */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Service Performance</h3>
              <div className="flex items-center space-x-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Hair">Hair</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Nails">Nails</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="revenue">Sort by Revenue</option>
                  <option value="bookings">Sort by Bookings</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="performance">Sort by Performance</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Service</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Performance</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Revenue</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Bookings</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Rating</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Trend</th>
                    <th className="text-center py-3 px-6 text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedServices
                    .filter(service => categoryFilter === 'all' || service.category === categoryFilter)
                    .map((service) => (
                    <tr key={service._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-primary-100">
                            <Scissors className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{service.name}</p>
                            <p className="text-sm text-gray-500">{service.category} • {service.duration}min</p>
                            {service.status === 'featured' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getPerformanceColor(service.analytics.performanceScore)
                          )}>
                            {getPerformanceIcon(service.analytics.performanceScore)}
                            <span className="ml-1">{service.analytics.performanceScore}</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(service.analytics.revenue)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(service.price)} per session
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900">{service.analytics.totalBookings}</p>
                        <p className="text-sm text-gray-500">
                          {service.analytics.conversionRate}% conversion
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold text-gray-900">
                            {service.analytics.averageRating}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({service.analytics.totalReviews})
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(service.analytics.seasonalTrend)}
                          <span className="text-sm text-gray-600 capitalize">
                            {service.analytics.seasonalTrend}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedService(service)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => optimizeService(service._id)}
                          >
                            <Zap className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Service View */}
      {viewMode === 'detailed' && selectedService && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-primary-100">
                  <Scissors className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedService.name}</h2>
                  <p className="text-gray-600">{selectedService.category} • {selectedService.duration}min • {formatCurrency(selectedService.price)}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedService(null)}
              >
                Back to Overview
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Metrics */}
              <div className="lg:col-span-2 space-y-6">
                {/* Trends Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={selectedService.trends.revenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Demographics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Demographics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Age Groups</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={selectedService.demographics.ageGroups}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="group" fontSize={12} />
                          <YAxis fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#06b6d4" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Loyalty Tiers</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={selectedService.demographics.loyaltyTiers}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="count"
                            label={({ tier, count }) => `${tier}: ${count}`}
                          >
                            {selectedService.demographics.loyaltyTiers.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Key Metrics</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Repeat Rate', value: `${selectedService.analytics.repeatCustomerRate}%`, icon: Users },
                      { label: 'Avg Wait Time', value: `${selectedService.analytics.avgWaitTime}min`, icon: Clock },
                      { label: 'Cancellation Rate', value: `${selectedService.analytics.cancellationRate}%`, icon: XCircle },
                      { label: 'Profit Margin', value: `${selectedService.analytics.profitMargin}%`, icon: DollarSign },
                    ].map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <metric.icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">{metric.label}</span>
                        </div>
                        <span className="font-medium text-gray-900">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitive Analysis */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Competitive Position</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Market Position</p>
                      <p className="font-medium text-gray-900 capitalize">{selectedService.competitiveAnalysis.marketPosition}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price Competitiveness</p>
                      <p className="font-medium text-gray-900">{selectedService.competitiveAnalysis.priceCompetitiveness}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Unique Selling Points</p>
                      <div className="space-y-1">
                        {selectedService.competitiveAnalysis.uniqueSellingPoints.map((point, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 mr-1 mb-1"
                          >
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Improvement Areas</p>
                      <div className="space-y-1">
                        {selectedService.competitiveAnalysis.improvementAreas.map((area, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mr-1 mb-1"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button className="w-full flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Optimize Service</span>
                  </Button>
                  <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Service</span>
                  </Button>
                  <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Comparison View */}
      {viewMode === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Comparison</h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Select services to compare (up to 4)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {services.map((service) => (
                  <label key={service._id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service._id)}
                      onChange={(e) => {
                        if (e.target.checked && selectedServices.length < 4) {
                          setSelectedServices([...selectedServices, service._id]);
                        } else if (!e.target.checked) {
                          setSelectedServices(selectedServices.filter(id => id !== service._id));
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-900">{service.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {selectedServices.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Revenue Comparison</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={services.filter(s => selectedServices.includes(s._id))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                      <Bar dataKey="analytics.revenue" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Performance Scores</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="20%"
                      outerRadius="80%"
                      barSize={40}
                      data={services.filter(s => selectedServices.includes(s._id)).map(s => ({
                        name: s.name.slice(0, 10) + '...',
                        score: s.analytics.performanceScore,
                        fill: CHART_COLORS[selectedServices.indexOf(s._id)],
                      }))}
                    >
                      <RadialBar
                        dataKey="score"
                        cornerRadius={10}
                        fill="#8884d8"
                      />
                      <Tooltip />
                      <Legend />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}