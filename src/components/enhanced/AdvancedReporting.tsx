'use client';

import { useState, useEffect } from 'react';
import {
  Download,
  FileText,
  Filter,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  DollarSign,
  Users,
  Package,
  Clock,
  Star,
  Zap,
  Target,
  Activity,
  Loader2,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, AreaChart, Area, Pie } from 'recharts';
import toast from 'react-hot-toast';

interface ReportData {
  overview: {
    totalRevenue: number;
    totalBookings: number;
    totalCustomers: number;
    averageOrderValue: number;
    conversionRate: number;
    customerRetention: number;
  };
  trends: {
    revenue: Array<{ date: string; value: number }>;
    bookings: Array<{ date: string; value: number }>;
    customers: Array<{ date: string; value: number }>;
  };
  segments: {
    services: Array<{ name: string; revenue: number; bookings: number; color: string }>;
    customers: Array<{ segment: string; count: number; revenue: number }>;
    timeSlots: Array<{ hour: string; bookings: number }>;
  };
  performance: {
    topServices: Array<{ name: string; revenue: number; bookings: number; rating: number }>;
    topStaff: Array<{ name: string; revenue: number; bookings: number; rating: number }>;
    customerSatisfaction: Array<{ rating: number; count: number }>;
  };
}

interface ReportFilters {
  dateRange: 'today' | '7d' | '30d' | '90d' | 'custom';
  customStartDate: string;
  customEndDate: string;
  services: string[];
  staff: string[];
  reportType: 'summary' | 'detailed' | 'custom';
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const reportTypes = [
  { id: 'summary', name: 'Executive Summary', description: 'High-level overview of key metrics' },
  { id: 'detailed', name: 'Detailed Analysis', description: 'Comprehensive breakdown of all metrics' },
  { id: 'financial', name: 'Financial Report', description: 'Revenue, costs, and profitability analysis' },
  { id: 'operational', name: 'Operations Report', description: 'Booking patterns and staff performance' },
  { id: 'customer', name: 'Customer Report', description: 'Customer behavior and satisfaction analysis' },
];

export default function AdvancedReporting() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: '30d',
    customStartDate: '',
    customEndDate: '',
    services: [],
    staff: [],
    reportType: 'summary',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReport, setSelectedReport] = useState('summary');

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - In production, this would be an API call
      const mockData: ReportData = {
        overview: {
          totalRevenue: 45890.50,
          totalBookings: 324,
          totalCustomers: 256,
          averageOrderValue: 141.67,
          conversionRate: 78.5,
          customerRetention: 65.2,
        },
        trends: {
          revenue: [
            { date: '2024-08-01', value: 1250 },
            { date: '2024-08-02', value: 1420 },
            { date: '2024-08-03', value: 1380 },
            { date: '2024-08-04', value: 1580 },
            { date: '2024-08-05', value: 1720 },
            { date: '2024-08-06', value: 1650 },
            { date: '2024-08-07', value: 1890 },
          ],
          bookings: [
            { date: '2024-08-01', value: 12 },
            { date: '2024-08-02', value: 15 },
            { date: '2024-08-03', value: 13 },
            { date: '2024-08-04', value: 18 },
            { date: '2024-08-05', value: 16 },
            { date: '2024-08-06', value: 14 },
            { date: '2024-08-07', value: 19 },
          ],
          customers: [
            { date: '2024-08-01', value: 8 },
            { date: '2024-08-02', value: 12 },
            { date: '2024-08-03', value: 10 },
            { date: '2024-08-04', value: 14 },
            { date: '2024-08-05', value: 11 },
            { date: '2024-08-06', value: 9 },
            { date: '2024-08-07', value: 15 },
          ],
        },
        segments: {
          services: [
            { name: 'Facial Treatments', revenue: 18500, bookings: 125, color: '#8b5cf6' },
            { name: 'Hair Styling', revenue: 15200, bookings: 98, color: '#06b6d4' },
            { name: 'Nail Services', revenue: 8900, bookings: 87, color: '#10b981' },
            { name: 'Massage Therapy', revenue: 3290, bookings: 14, color: '#f59e0b' },
          ],
          customers: [
            { segment: 'New Customers', count: 89, revenue: 12560 },
            { segment: 'Returning Customers', count: 145, revenue: 28990 },
            { segment: 'VIP Customers', count: 22, revenue: 4340 },
          ],
          timeSlots: [
            { hour: '9:00', bookings: 45 },
            { hour: '10:00', bookings: 52 },
            { hour: '11:00', bookings: 48 },
            { hour: '12:00', bookings: 31 },
            { hour: '13:00', bookings: 28 },
            { hour: '14:00', bookings: 42 },
            { hour: '15:00', bookings: 38 },
            { hour: '16:00', bookings: 40 },
          ],
        },
        performance: {
          topServices: [
            { name: 'Deluxe Facial', revenue: 8500, bookings: 45, rating: 4.9 },
            { name: 'Hair Cut & Style', revenue: 7200, bookings: 62, rating: 4.7 },
            { name: 'Gel Manicure', revenue: 4800, bookings: 58, rating: 4.8 },
            { name: 'Deep Tissue Massage', revenue: 3200, bookings: 14, rating: 4.9 },
          ],
          topStaff: [
            { name: 'Sarah Johnson', revenue: 15600, bookings: 89, rating: 4.8 },
            { name: 'Maria Garcia', revenue: 12400, bookings: 72, rating: 4.7 },
            { name: 'Emma Wilson', revenue: 8900, bookings: 54, rating: 4.9 },
          ],
          customerSatisfaction: [
            { rating: 5, count: 189 },
            { rating: 4, count: 97 },
            { rating: 3, count: 23 },
            { rating: 2, count: 8 },
            { rating: 1, count: 3 },
          ],
        },
      };

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setReportData(mockData);
    } catch (error) {
      console.error('Error loading report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      setIsExporting(true);
      
      // Mock export - In production, this would generate and download the file
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  const updateFilters = (key: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Generating reports...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
        <p className="text-gray-600">Unable to load report data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Reporting</h2>
          <p className="text-gray-600 mt-1">Comprehensive analytics and business insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              disabled={isExporting}
            >
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('excel')}
              disabled={isExporting}
            >
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => updateFilters('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {filters.dateRange === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={filters.customStartDate}
                    onChange={(e) => updateFilters('customStartDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={filters.customEndDate}
                    onChange={(e) => updateFilters('customEndDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {reportTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {reportTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => setSelectedReport(type.id)}
            className={cn(
              'p-4 rounded-xl border-2 cursor-pointer transition-all',
              selectedReport === type.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <h3 className="font-medium text-gray-900">{type.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{type.description}</p>
          </div>
        ))}
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-500" />
            <span className="text-xs text-green-600 font-medium">+12.5%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.overview.totalRevenue)}</p>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-500" />
            <span className="text-xs text-blue-600 font-medium">+8.3%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalBookings}</p>
          <p className="text-sm text-gray-600">Total Bookings</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-purple-500" />
            <span className="text-xs text-purple-600 font-medium">+15.2%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalCustomers}</p>
          <p className="text-sm text-gray-600">Total Customers</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-orange-500" />
            <span className="text-xs text-orange-600 font-medium">+3.1%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.overview.averageOrderValue)}</p>
          <p className="text-sm text-gray-600">Avg Order Value</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            <span className="text-xs text-yellow-600 font-medium">+5.7%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.overview.conversionRate}%</p>
          <p className="text-sm text-gray-600">Conversion Rate</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-pink-500" />
            <span className="text-xs text-pink-600 font-medium">+2.4%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.overview.customerRetention}%</p>
          <p className="text-sm text-gray-600">Retention Rate</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportData.trends.revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']} />
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Service Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Revenue Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                dataKey="revenue"
                data={reportData.segments.services}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(props: any) => `${props.name}: ${(props.percent * 100).toFixed(1)}%`}
              >
                {reportData.segments.services.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Services */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Services</h3>
          <div className="space-y-4">
            {reportData.performance.topServices.map((service, index) => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-600">{service.bookings} bookings</p>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="font-bold text-primary-600">{formatCurrency(service.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Staff */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Staff</h3>
          <div className="space-y-4">
            {reportData.performance.topStaff.map((staff, index) => (
              <div key={staff.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{staff.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-600">{staff.bookings} bookings</p>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">{staff.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="font-bold text-green-600">{formatCurrency(staff.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Booking Hours</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reportData.segments.timeSlots}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Summary */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary-900">Export Complete Report</h3>
            <p className="text-primary-800 mt-1">Download comprehensive analytics for further analysis</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-primary-700">Available formats:</span>
            <div className="flex space-x-2">
              <Button size="sm" onClick={() => handleExport('pdf')} disabled={isExporting}>
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleExport('excel')} disabled={isExporting}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}