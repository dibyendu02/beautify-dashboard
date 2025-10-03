'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Package,
  Clock,
  Star,
  Filter,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  FileText,
  Image as ImageIcon,
  Share2,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  ComposedChart,
  Legend
} from 'recharts';
import toast from 'react-hot-toast';

interface AnalyticsData {
  summary: {
    totalRevenue: number;
    totalBookings: number;
    totalCustomers: number;
    averageOrderValue: number;
    growthRate: number;
    conversionRate: number;
  };
  trends: {
    revenue: Array<{ date: string; value: number; previousPeriod?: number }>;
    bookings: Array<{ date: string; value: number; previousPeriod?: number }>;
    customers: Array<{ date: string; new: number; returning: number }>;
  };
  performance: {
    topServices: Array<{ name: string; revenue: number; bookings: number; growth: number }>;
    topStaff: Array<{ name: string; revenue: number; bookings: number; rating: number }>;
    hourlyDistribution: Array<{ hour: string; bookings: number; revenue: number }>;
  };
  customerMetrics: {
    retention: { rate: number; trend: number };
    satisfaction: { average: number; distribution: Array<{ rating: number; count: number }> };
    lifetime_value: number;
    acquisition_cost: number;
  };
}

interface DateRange {
  start: string;
  end: string;
  preset: 'today' | '7d' | '30d' | '90d' | 'ytd' | 'custom';
}

interface AnalyticsFilters {
  dateRange: DateRange;
  compareWith?: DateRange;
  services: string[];
  staff: string[];
  customerSegment: 'all' | 'new' | 'returning' | 'vip';
  metricView: 'revenue' | 'bookings' | 'customers' | 'performance';
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16', '#f97316'];

const datePresets = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'custom', label: 'Custom Range' },
];

export default function EnhancedAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      preset: '30d',
    },
    services: [],
    staff: [],
    customerSegment: 'all',
    metricView: 'revenue',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeChart, setActiveChart] = useState<'line' | 'area' | 'bar'>('area');

  useEffect(() => {
    loadAnalyticsData();
  }, [filters]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data with comparison to previous period
      const mockData: AnalyticsData = {
        summary: {
          totalRevenue: 125890.50,
          totalBookings: 847,
          totalCustomers: 623,
          averageOrderValue: 148.67,
          growthRate: 15.3,
          conversionRate: 73.2,
        },
        trends: {
          revenue: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            value: Math.floor(Math.random() * 5000) + 2000,
            previousPeriod: Math.floor(Math.random() * 4500) + 1800,
          })),
          bookings: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            value: Math.floor(Math.random() * 30) + 15,
            previousPeriod: Math.floor(Math.random() * 25) + 12,
          })),
          customers: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new: Math.floor(Math.random() * 15) + 5,
            returning: Math.floor(Math.random() * 20) + 8,
          })),
        },
        performance: {
          topServices: [
            { name: 'Deluxe Facial', revenue: 28500, bookings: 145, growth: 18.5 },
            { name: 'Hair Styling', revenue: 22400, bookings: 189, growth: 12.3 },
            { name: 'Nail Services', revenue: 18900, bookings: 234, growth: 8.7 },
            { name: 'Massage Therapy', revenue: 15600, bookings: 89, growth: 25.1 },
            { name: 'Eyebrow Threading', revenue: 8900, bookings: 178, growth: -2.3 },
          ],
          topStaff: [
            { name: 'Sarah Johnson', revenue: 45600, bookings: 289, rating: 4.9 },
            { name: 'Maria Garcia', revenue: 38200, bookings: 247, rating: 4.8 },
            { name: 'Emma Wilson', revenue: 29800, bookings: 198, rating: 4.7 },
            { name: 'Lisa Chen', revenue: 24600, bookings: 156, rating: 4.8 },
          ],
          hourlyDistribution: [
            { hour: '09:00', bookings: 12, revenue: 1890 },
            { hour: '10:00', bookings: 18, revenue: 2450 },
            { hour: '11:00', bookings: 22, revenue: 3200 },
            { hour: '12:00', bookings: 15, revenue: 2100 },
            { hour: '13:00', bookings: 13, revenue: 1850 },
            { hour: '14:00', bookings: 25, revenue: 3680 },
            { hour: '15:00', bookings: 28, revenue: 4200 },
            { hour: '16:00', bookings: 24, revenue: 3550 },
            { hour: '17:00', bookings: 20, revenue: 2900 },
            { hour: '18:00', bookings: 16, revenue: 2400 },
          ],
        },
        customerMetrics: {
          retention: { rate: 68.4, trend: 5.2 },
          satisfaction: {
            average: 4.7,
            distribution: [
              { rating: 5, count: 542 },
              { rating: 4, count: 234 },
              { rating: 3, count: 45 },
              { rating: 2, count: 12 },
              { rating: 1, count: 3 },
            ],
          },
          lifetime_value: 485.90,
          acquisition_cost: 28.50,
        },
      };

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'png' | 'csv') => {
    try {
      setIsExporting(true);
      
      // Mock export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Analytics exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast.error('Failed to export analytics');
    } finally {
      setIsExporting(false);
    }
  };

  const updateDateRange = (preset: DateRange['preset'], customStart?: string, customEnd?: string) => {
    let start: string, end: string;
    const now = new Date();
    
    switch (preset) {
      case 'today':
        start = end = now.toISOString().split('T')[0];
        break;
      case '7d':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        end = now.toISOString().split('T')[0];
        break;
      case '30d':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        end = now.toISOString().split('T')[0];
        break;
      case '90d':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        end = now.toISOString().split('T')[0];
        break;
      case 'ytd':
        start = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        end = now.toISOString().split('T')[0];
        break;
      case 'custom':
        start = customStart || filters.dateRange.start;
        end = customEnd || filters.dateRange.end;
        break;
      default:
        return;
    }

    setFilters(prev => ({
      ...prev,
      dateRange: { start, end, preset },
    }));
  };

  const renderTrendChart = () => {
    if (!analyticsData) return null;

    const data = filters.metricView === 'revenue' 
      ? analyticsData.trends.revenue
      : filters.metricView === 'bookings'
      ? analyticsData.trends.bookings
      : analyticsData.trends.customers.map(d => ({ ...d, value: d.new + d.returning }));

    const ChartComponent = activeChart === 'line' ? LineChart : activeChart === 'area' ? AreaChart : BarChart;

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            formatter={(value: any, name: string) => {
              const formattedValue = filters.metricView === 'revenue' 
                ? formatCurrency(Number(value))
                : Number(value).toLocaleString();
              return [formattedValue, name === 'value' ? 'Current Period' : 'Previous Period'];
            }}
          />
          <Legend />
          
          {activeChart === 'line' && (
            <>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                name="Current Period"
              />
              {data[0]?.previousPeriod !== undefined && (
                <Line 
                  type="monotone" 
                  dataKey="previousPeriod" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Previous Period"
                />
              )}
            </>
          )}
          
          {activeChart === 'area' && (
            <>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.3}
                name="Current Period"
              />
              {data[0]?.previousPeriod !== undefined && (
                <Area 
                  type="monotone" 
                  dataKey="previousPeriod" 
                  stroke="#94a3b8" 
                  fill="#94a3b8" 
                  fillOpacity={0.1}
                  name="Previous Period"
                />
              )}
            </>
          )}
          
          {activeChart === 'bar' && (
            <>
              <Bar 
                dataKey="value" 
                fill="#8b5cf6"
                name="Current Period"
              />
              {data[0]?.previousPeriod !== undefined && (
                <Bar 
                  dataKey="previousPeriod" 
                  fill="#94a3b8"
                  name="Previous Period"
                />
              )}
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
        <p className="text-gray-600">Unable to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Analytics</h2>
          <p className="text-gray-600 mt-1">Advanced insights with custom date ranges and comparisons</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button
            variant="outline"
            onClick={() => loadAnalyticsData()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('png')}
              disabled={isExporting}
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('excel')}
              disabled={isExporting}
            >
              <FileText className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-4">
          {/* Date Range Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              {datePresets.map(preset => (
                <Button
                  key={preset.value}
                  variant={filters.dateRange.preset === preset.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateDateRange(preset.value as DateRange['preset'])}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            
            {filters.dateRange.preset === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => updateDateRange('custom', e.target.value, filters.dateRange.end)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => updateDateRange('custom', filters.dateRange.start, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Metric View and Customer Segment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Metric</label>
              <select
                value={filters.metricView}
                onChange={(e) => setFilters(prev => ({ ...prev, metricView: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="revenue">Revenue</option>
                <option value="bookings">Bookings</option>
                <option value="customers">Customers</option>
                <option value="performance">Performance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Segment</label>
              <select
                value={filters.customerSegment}
                onChange={(e) => setFilters(prev => ({ ...prev, customerSegment: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Customers</option>
                <option value="new">New Customers</option>
                <option value="returning">Returning Customers</option>
                <option value="vip">VIP Customers</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-500" />
            <span className="text-xs text-green-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{analyticsData.summary.growthRate}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.summary.totalRevenue)}</p>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-500" />
            <span className="text-xs text-blue-600 font-medium">+12.3%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.summary.totalBookings.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Bookings</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-purple-500" />
            <span className="text-xs text-purple-600 font-medium">+8.7%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.summary.totalCustomers.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Customers</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-orange-500" />
            <span className="text-xs text-orange-600 font-medium">+5.2%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.summary.averageOrderValue)}</p>
          <p className="text-sm text-gray-600">Avg Order Value</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-pink-500" />
            <span className="text-xs text-pink-600 font-medium">+{analyticsData.customerMetrics.retention.trend}%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.customerMetrics.retention.rate}%</p>
          <p className="text-sm text-gray-600">Retention Rate</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            <span className="text-xs text-yellow-600 font-medium">+3.1%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.summary.conversionRate}%</p>
          <p className="text-sm text-gray-600">Conversion Rate</p>
        </div>
      </div>

      {/* Main Trend Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {filters.metricView} Trends
          </h3>
          <div className="flex items-center space-x-2">
            {(['line', 'area', 'bar'] as const).map(chartType => (
              <Button
                key={chartType}
                variant={activeChart === chartType ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveChart(chartType)}
              >
                {chartType === 'line' && <Activity className="w-4 h-4" />}
                {chartType === 'area' && <BarChart3 className="w-4 h-4" />}
                {chartType === 'bar' && <BarChart3 className="w-4 h-4" />}
              </Button>
            ))}
          </div>
        </div>
        {renderTrendChart()}
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Services</h3>
          <div className="space-y-4">
            {analyticsData.performance.topServices.map((service, index) => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-600">{service.bookings} bookings</p>
                      <span className={cn(
                        'text-xs font-medium flex items-center',
                        service.growth > 0 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {service.growth > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {Math.abs(service.growth)}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="font-bold text-primary-600">{formatCurrency(service.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Satisfaction</h3>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {analyticsData.customerMetrics.satisfaction.average}
            </div>
            <div className="flex items-center justify-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-6 h-6',
                    i < Math.floor(analyticsData.customerMetrics.satisfaction.average)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">Average Rating</p>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.customerMetrics.satisfaction.distribution}>
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary-900">Export Analytics</h3>
            <p className="text-primary-800 mt-1">Download detailed reports and visualizations</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              size="sm" 
              onClick={() => handleExport('pdf')} 
              disabled={isExporting}
            >
              PDF Report
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleExport('excel')} 
              disabled={isExporting}
            >
              Excel Data
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleExport('png')} 
              disabled={isExporting}
            >
              Chart Images
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}