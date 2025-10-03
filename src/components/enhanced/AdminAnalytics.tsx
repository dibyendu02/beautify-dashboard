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
  Treemap,
  ScatterChart,
  Scatter,
} from 'recharts';
import {
  Users,
  Store,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Globe,
  Shield,
  Activity,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Server,
  Database,
  Cpu,
  HardDrive,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface AdminAnalyticsData {
  platformOverview: {
    totalUsers: number;
    totalMerchants: number;
    totalBookings: number;
    totalRevenue: number;
    platformFees: number;
    growth: {
      users: number;
      merchants: number;
      bookings: number;
      revenue: number;
    };
  };
  userGrowth: Array<{
    date: string;
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    merchantSignups: number;
  }>;
  revenueBreakdown: Array<{
    month: string;
    platformRevenue: number;
    merchantRevenue: number;
    commissions: number;
  }>;
  geographicData: Array<{
    region: string;
    users: number;
    merchants: number;
    revenue: number;
  }>;
  systemMetrics: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    activeConnections: number;
    serverLoad: number;
    databaseSize: number;
    storageUsed: number;
  };
  merchantCategories: Array<{
    category: string;
    count: number;
    revenue: number;
    color: string;
  }>;
  topMerchants: Array<{
    id: string;
    name: string;
    owner: string;
    revenue: number;
    bookings: number;
    rating: number;
    status: string;
  }>;
  securityEvents: Array<{
    type: string;
    count: number;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
  }>;
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#8b5cf6'];

export default function AdminAnalytics() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeData, setRealTimeData] = useState({
    liveUsers: 1247,
    activeBookings: 23,
    serverResponse: 142,
  });

  // Mock data for demonstration
  useEffect(() => {
    setData({
      platformOverview: {
        totalUsers: 25874,
        totalMerchants: 547,
        totalBookings: 15678,
        totalRevenue: 1245678.90,
        platformFees: 186851.34,
        growth: {
          users: 18.5,
          merchants: 12.3,
          bookings: 25.7,
          revenue: 22.1,
        },
      },
      userGrowth: [
        { date: '2024-01-01', totalUsers: 20000, newUsers: 150, activeUsers: 1200, merchantSignups: 8 },
        { date: '2024-01-02', totalUsers: 20150, newUsers: 175, activeUsers: 1350, merchantSignups: 12 },
        { date: '2024-01-03', totalUsers: 20325, newUsers: 200, activeUsers: 1450, merchantSignups: 15 },
        { date: '2024-01-04', totalUsers: 20525, newUsers: 180, activeUsers: 1380, merchantSignups: 9 },
        { date: '2024-01-05', totalUsers: 20705, newUsers: 220, activeUsers: 1520, merchantSignups: 18 },
        { date: '2024-01-06', totalUsers: 20925, newUsers: 250, activeUsers: 1650, merchantSignups: 22 },
        { date: '2024-01-07', totalUsers: 21175, newUsers: 190, activeUsers: 1420, merchantSignups: 14 },
      ],
      revenueBreakdown: [
        { month: 'Jan', platformRevenue: 15000, merchantRevenue: 85000, commissions: 12750 },
        { month: 'Feb', platformRevenue: 18500, merchantRevenue: 102000, commissions: 15300 },
        { month: 'Mar', platformRevenue: 22000, merchantRevenue: 118000, commissions: 17700 },
        { month: 'Apr', platformRevenue: 19800, merchantRevenue: 112000, commissions: 16800 },
        { month: 'May', platformRevenue: 25000, merchantRevenue: 135000, commissions: 20250 },
        { month: 'Jun', platformRevenue: 28500, merchantRevenue: 147000, commissions: 22050 },
      ],
      geographicData: [
        { region: 'North America', users: 8500, merchants: 180, revenue: 450000 },
        { region: 'Europe', users: 12000, merchants: 220, revenue: 580000 },
        { region: 'Asia', users: 3500, merchants: 95, revenue: 180000 },
        { region: 'South America', users: 1500, merchants: 35, revenue: 85000 },
        { region: 'Australia', users: 374, merchants: 17, revenue: 25000 },
      ],
      systemMetrics: {
        uptime: 99.95,
        responseTime: 142,
        errorRate: 0.02,
        activeConnections: 1247,
        serverLoad: 68,
        databaseSize: 2.4,
        storageUsed: 78.5,
      },
      merchantCategories: [
        { category: 'Hair Salons', count: 156, revenue: 425000, color: '#8b5cf6' },
        { category: 'Beauty Spas', count: 98, revenue: 385000, color: '#06b6d4' },
        { category: 'Nail Studios', count: 87, revenue: 185000, color: '#10b981' },
        { category: 'Massage Therapy', count: 65, revenue: 165000, color: '#f59e0b' },
        { category: 'Skincare Clinics', count: 78, revenue: 285000, color: '#ef4444' },
        { category: 'Barbershops', count: 63, revenue: 125000, color: '#ec4899' },
      ],
      topMerchants: [
        { id: '1', name: 'Elite Beauty Spa', owner: 'Emma Thompson', revenue: 35420, bookings: 245, rating: 4.9, status: 'active' },
        { id: '2', name: 'Urban Hair Studio', owner: 'James Rodriguez', revenue: 28900, bookings: 198, rating: 4.8, status: 'active' },
        { id: '3', name: 'Glow Skincare', owner: 'Lisa Chen', revenue: 24500, bookings: 167, rating: 4.7, status: 'active' },
        { id: '4', name: 'Zen Wellness', owner: 'David Kumar', revenue: 22100, bookings: 134, rating: 4.9, status: 'active' },
        { id: '5', name: 'Perfect Nails', owner: 'Sofia Martinez', revenue: 18750, bookings: 189, rating: 4.6, status: 'active' },
      ],
      securityEvents: [
        { type: 'Failed Login Attempts', count: 24, severity: 'medium', timestamp: '2024-01-07 14:30' },
        { type: 'Rate Limit Exceeded', count: 8, severity: 'low', timestamp: '2024-01-07 13:45' },
        { type: 'Suspicious Payment Activity', count: 2, severity: 'high', timestamp: '2024-01-07 12:15' },
        { type: 'API Abuse Detected', count: 5, severity: 'medium', timestamp: '2024-01-07 11:30' },
      ],
    });
  }, [timeRange]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        liveUsers: prev.liveUsers + Math.floor(Math.random() * 10) - 5,
        activeBookings: prev.activeBookings + Math.floor(Math.random() * 6) - 3,
        serverResponse: prev.serverResponse + Math.floor(Math.random() * 20) - 10,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const exportData = () => {
    console.log('Exporting admin analytics data...');
  };

  if (!data) return <div className="p-6">Loading admin analytics...</div>;

  const tabs = [
    { id: 'overview', name: 'Platform Overview', icon: Activity },
    { id: 'users', name: 'Users & Growth', icon: Users },
    { id: 'merchants', name: 'Merchants', icon: Store },
    { id: 'revenue', name: 'Revenue Analytics', icon: DollarSign },
    { id: 'system', name: 'System Health', icon: Server },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive platform insights and system monitoring</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Live Data</span>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
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

      {/* Real-time Stats */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Live Platform Status</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Real-time</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold">{realTimeData.liveUsers.toLocaleString()}</p>
            <p className="text-sm opacity-90">Live Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{realTimeData.activeBookings}</p>
            <p className="text-sm opacity-90">Active Bookings</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{realTimeData.serverResponse}ms</p>
            <p className="text-sm opacity-90">Avg Response Time</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.platformOverview.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">
              +{data.platformOverview.growth.users}%
            </span>
            <span className="text-sm text-gray-600 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Merchants</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.platformOverview.totalMerchants.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">
              +{data.platformOverview.growth.merchants}%
            </span>
            <span className="text-sm text-gray-600 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(data.platformOverview.platformFees)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">
              +{data.platformOverview.growth.revenue}%
            </span>
            <span className="text-sm text-gray-600 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.systemMetrics.uptime}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Server className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">Excellent</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
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
              {/* User Growth Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={data.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="totalUsers"
                      fill="#6366f1"
                      fillOpacity={0.1}
                      stroke="#6366f1"
                    />
                    <Bar yAxisId="right" dataKey="newUsers" fill="#10b981" />
                    <Line yAxisId="right" type="monotone" dataKey="merchantSignups" stroke="#f59e0b" strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Geographic Distribution & Merchant Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
                  <div className="space-y-4">
                    {data.geographicData.map((region, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{region.region}</p>
                          <p className="text-sm text-gray-600">{region.users} users, {region.merchants} merchants</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(region.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Merchant Categories</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={data.merchantCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, count }) => `${category}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {data.merchantCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-8">
              {/* System Health Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Server Load</p>
                      <p className="text-2xl font-bold text-green-900 mt-1">{data.systemMetrics.serverLoad}%</p>
                    </div>
                    <Cpu className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-4">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${data.systemMetrics.serverLoad}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Database Size</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">{data.systemMetrics.databaseSize}GB</p>
                    </div>
                    <Database className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex items-center mt-4">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-700">Optimized</span>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-800">Storage Used</p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">{data.systemMetrics.storageUsed}%</p>
                    </div>
                    <HardDrive className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2 mt-4">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${data.systemMetrics.storageUsed}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Error Rate</p>
                      <p className="text-2xl font-bold text-yellow-900 mt-1">{data.systemMetrics.errorRate}%</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="flex items-center mt-4">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-700">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Events</h3>
                <div className="space-y-4">
                  {data.securityEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={cn(
                          'w-3 h-3 rounded-full mr-3',
                          event.severity === 'high' ? 'bg-red-500' :
                          event.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        )}></div>
                        <div>
                          <p className="font-medium text-gray-900">{event.type}</p>
                          <p className="text-sm text-gray-600">{event.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900 mr-2">{event.count}</span>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          event.severity === 'high' ? 'bg-red-100 text-red-800' :
                          event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        )}>
                          {event.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}