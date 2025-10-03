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
  Cpu,
  HardDrive,
  Wifi,
  Monitor,
  AlertCircle,
  Power,
  RotateCcw,
  Terminal,
  Bug,
  ShieldCheck,
  Gauge,
  MemoryStick,
  Network,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface SystemMetrics {
  server: {
    uptime: number;
    cpu: number;
    memory: number;
    disk: number;
    network: {
      incoming: number;
      outgoing: number;
    };
  };
  database: {
    status: 'healthy' | 'warning' | 'critical';
    connections: number;
    queryTime: number;
    size: number;
  };
  api: {
    responseTime: number;
    errorRate: number;
    requestsPerMinute: number;
    healthStatus: 'healthy' | 'degraded' | 'down';
  };
  security: {
    lastSecurityScan: string;
    vulnerabilities: number;
    firewall: 'active' | 'inactive';
    sslStatus: 'valid' | 'expiring' | 'expired';
  };
  services: Array<{
    name: string;
    status: 'running' | 'stopped' | 'error';
    uptime: number;
    lastRestart: string;
  }>;
  logs: Array<{
    id: string;
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'critical';
    service: string;
    message: string;
  }>;
}

export default function SystemPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    server: {
      uptime: 99.98,
      cpu: 45.2,
      memory: 68.4,
      disk: 34.7,
      network: {
        incoming: 125.6,
        outgoing: 89.3,
      },
    },
    database: {
      status: 'healthy',
      connections: 42,
      queryTime: 1.2,
      size: 15.6,
    },
    api: {
      responseTime: 145,
      errorRate: 0.02,
      requestsPerMinute: 1250,
      healthStatus: 'healthy',
    },
    security: {
      lastSecurityScan: '2024-01-03T10:30:00Z',
      vulnerabilities: 0,
      firewall: 'active',
      sslStatus: 'valid',
    },
    services: [
      {
        name: 'Web Server (Nginx)',
        status: 'running',
        uptime: 99.99,
        lastRestart: '2024-01-01T00:00:00Z',
      },
      {
        name: 'Application Server',
        status: 'running',
        uptime: 99.95,
        lastRestart: '2024-01-02T14:30:00Z',
      },
      {
        name: 'Database (PostgreSQL)',
        status: 'running',
        uptime: 100.0,
        lastRestart: '2023-12-28T08:15:00Z',
      },
      {
        name: 'Redis Cache',
        status: 'running',
        uptime: 99.98,
        lastRestart: '2024-01-01T12:00:00Z',
      },
      {
        name: 'Email Service',
        status: 'running',
        uptime: 99.8,
        lastRestart: '2024-01-03T09:45:00Z',
      },
      {
        name: 'Payment Gateway',
        status: 'running',
        uptime: 99.99,
        lastRestart: '2023-12-30T16:20:00Z',
      },
    ],
    logs: [
      {
        id: '1',
        timestamp: '2024-01-03T14:45:00Z',
        level: 'info',
        service: 'API Server',
        message: 'Successfully processed 1000+ requests in the last hour',
      },
      {
        id: '2',
        timestamp: '2024-01-03T14:30:00Z',
        level: 'warning',
        service: 'Database',
        message: 'Query execution time exceeded 5 seconds for complex analytics query',
      },
      {
        id: '3',
        timestamp: '2024-01-03T14:15:00Z',
        level: 'info',
        service: 'Email Service',
        message: 'Weekly newsletter sent to 2,456 subscribers',
      },
      {
        id: '4',
        timestamp: '2024-01-03T14:00:00Z',
        level: 'error',
        service: 'Payment Gateway',
        message: 'Payment processing temporarily delayed for 3 transactions',
      },
      {
        id: '5',
        timestamp: '2024-01-03T13:45:00Z',
        level: 'info',
        service: 'Backup Service',
        message: 'Daily database backup completed successfully',
      },
    ],
  });

  const refreshMetrics = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      // Update with new demo data
      setSystemMetrics(prev => ({
        ...prev,
        server: {
          ...prev.server,
          cpu: Math.random() * 80 + 10,
          memory: Math.random() * 90 + 10,
        },
      }));
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
      case 'active':
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'warning':
      case 'degraded':
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
      case 'error':
      case 'down':
      case 'stopped':
      case 'expired':
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
      case 'active':
      case 'valid':
        return <CheckCircle className="w-3 h-3" />;
      case 'warning':
      case 'degraded':
      case 'expiring':
        return <AlertTriangle className="w-3 h-3" />;
      case 'critical':
      case 'error':
      case 'down':
      case 'stopped':
      case 'expired':
      case 'inactive':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'critical':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (value: number, type: 'cpu' | 'memory' | 'disk') => {
    if (type === 'cpu' || type === 'memory') {
      if (value > 80) return 'text-red-600';
      if (value > 60) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'disk') {
      if (value > 90) return 'text-red-600';
      if (value > 70) return 'text-yellow-600';
      return 'text-green-600';
    }
    return 'text-slate-600';
  };

  const notifications = [
    {
      id: '1',
      title: 'System Alert',
      message: 'High CPU usage detected on server 2',
      time: '5 min ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Backup Completed',
      message: 'Daily system backup completed successfully',
      time: '1 hour ago',
      unread: false,
    },
    {
      id: '3',
      title: 'Security Scan',
      message: 'Weekly security scan completed - no issues found',
      time: '2 hours ago',
      unread: false,
    },
  ];

  return (
    <AdminLayout notifications={notifications}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">System Monitoring</h1>
            <p className="text-slate-600 mt-1">
              Monitor system health, performance, and security
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshMetrics}
              disabled={refreshing}
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', refreshing && 'animate-spin')} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">System Health Overview</h2>
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              All Systems Operational
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Server Uptime */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Server className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{systemMetrics.server.uptime}%</p>
              <p className="text-sm text-slate-600">Server Uptime</p>
            </div>

            {/* API Response Time */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{systemMetrics.api.responseTime}ms</p>
              <p className="text-sm text-slate-600">API Response Time</p>
            </div>

            {/* Database Status */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{systemMetrics.database.connections}</p>
              <p className="text-sm text-slate-600">DB Connections</p>
            </div>

            {/* Error Rate */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{systemMetrics.api.errorRate}%</p>
              <p className="text-sm text-slate-600">Error Rate</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Server Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Server Performance</h3>
            <div className="space-y-6">
              {/* CPU Usage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Cpu className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm font-medium text-slate-700">CPU Usage</span>
                  </div>
                  <span className={cn('text-sm font-semibold', getPerformanceColor(systemMetrics.server.cpu, 'cpu'))}>
                    {systemMetrics.server.cpu.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={cn(
                      'h-2 rounded-full',
                      systemMetrics.server.cpu > 80 ? 'bg-red-500' :
                      systemMetrics.server.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    )}
                    style={{ width: `${systemMetrics.server.cpu}%` }}
                  ></div>
                </div>
              </div>

              {/* Memory Usage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <MemoryStick className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm font-medium text-slate-700">Memory Usage</span>
                  </div>
                  <span className={cn('text-sm font-semibold', getPerformanceColor(systemMetrics.server.memory, 'memory'))}>
                    {systemMetrics.server.memory.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={cn(
                      'h-2 rounded-full',
                      systemMetrics.server.memory > 80 ? 'bg-red-500' :
                      systemMetrics.server.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    )}
                    style={{ width: `${systemMetrics.server.memory}%` }}
                  ></div>
                </div>
              </div>

              {/* Disk Usage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <HardDrive className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm font-medium text-slate-700">Disk Usage</span>
                  </div>
                  <span className={cn('text-sm font-semibold', getPerformanceColor(systemMetrics.server.disk, 'disk'))}>
                    {systemMetrics.server.disk.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={cn(
                      'h-2 rounded-full',
                      systemMetrics.server.disk > 90 ? 'bg-red-500' :
                      systemMetrics.server.disk > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    )}
                    style={{ width: `${systemMetrics.server.disk}%` }}
                  ></div>
                </div>
              </div>

              {/* Network */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Network className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm font-medium text-slate-700">Network Traffic</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Incoming: </span>
                    <span className="font-semibold text-green-600">{systemMetrics.server.network.incoming} MB/s</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Outgoing: </span>
                    <span className="font-semibold text-blue-600">{systemMetrics.server.network.outgoing} MB/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Security Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <ShieldCheck className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-slate-700">Firewall</span>
                </div>
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(systemMetrics.security.firewall)
                )}>
                  {getStatusIcon(systemMetrics.security.firewall)}
                  <span className="ml-1 capitalize">{systemMetrics.security.firewall}</span>
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-slate-700">SSL Certificate</span>
                </div>
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(systemMetrics.security.sslStatus)
                )}>
                  {getStatusIcon(systemMetrics.security.sslStatus)}
                  <span className="ml-1 capitalize">{systemMetrics.security.sslStatus}</span>
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <Bug className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-sm font-medium text-slate-700">Vulnerabilities</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {systemMetrics.security.vulnerabilities} found
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <Monitor className="w-5 h-5 text-slate-400 mr-3" />
                  <span className="text-sm font-medium text-slate-700">Last Security Scan</span>
                </div>
                <span className="text-sm text-slate-600">
                  {new Date(systemMetrics.security.lastSecurityScan).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Services Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemMetrics.services.map((service, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-900">{service.name}</h4>
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(service.status)
                  )}>
                    {getStatusIcon(service.status)}
                    <span className="ml-1 capitalize">{service.status}</span>
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">{service.uptime.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Restart:</span>
                    <span className="font-medium">
                      {new Date(service.lastRestart).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Recent System Logs</h2>
            <Button variant="outline" size="sm">
              <Terminal className="w-4 h-4 mr-2" />
              View All Logs
            </Button>
          </div>
          
          <div className="space-y-3">
            {systemMetrics.logs.map((log) => (
              <div key={log.id} className="flex items-start p-3 bg-slate-50 rounded-lg">
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 mt-0.5',
                  getLogLevelColor(log.level)
                )}>
                  {log.level.toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900">{log.service}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Maintenance & Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart Services
            </Button>
            <Button variant="outline" className="justify-start">
              <Database className="w-4 h-4 mr-2" />
              Database Backup
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Security Scan
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Metrics
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}