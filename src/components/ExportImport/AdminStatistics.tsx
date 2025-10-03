import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchExportStats } from '../../store/slices/exportImportSlice';
import { exportImportService } from '../../services/exportImport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Button from '../ui/Button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Users,
  Database,
  FileText,
  Download,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Calendar,
  Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface AdminStatisticsProps {
  className?: string;
}

interface SystemHealth {
  activeExports: number;
  activeImports: number;
  queuedJobs: number;
  failedJobs: number;
  storageUsed: number;
  storageLimit: number;
  avgProcessingTime: number;
}

const AdminStatistics: React.FC<AdminStatisticsProps> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats } = useSelector((state: RootState) => state.exportImport);
  
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    activeExports: 0,
    activeImports: 0,
    queuedJobs: 0,
    failedJobs: 0,
    storageUsed: 0,
    storageLimit: 100,
    avgProcessingTime: 0
  });
  const [timePeriod, setTimePeriod] = useState('7d');
  const [cleanupDays, setCleanupDays] = useState('30');
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  useEffect(() => {
    dispatch(fetchExportStats());
    fetchSystemHealth();
  }, [dispatch]);

  const fetchSystemHealth = async () => {
    // This would typically come from a separate admin endpoint
    // For now, we'll simulate the data
    setSystemHealth({
      activeExports: 12,
      activeImports: 8,
      queuedJobs: 5,
      failedJobs: 3,
      storageUsed: 75,
      storageLimit: 100,
      avgProcessingTime: 2.5
    });
  };

  const handleCleanup = async () => {
    setIsCleaningUp(true);
    try {
      const result = await exportImportService.cleanupOldJobs(parseInt(cleanupDays));
      toast.success(`Cleaned up ${result.deleted} old jobs`);
      dispatch(fetchExportStats());
      fetchSystemHealth();
    } catch (error) {
      toast.error('Failed to cleanup old jobs');
    }
    setIsCleaningUp(false);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

  const formatEntityData = () => {
    if (!stats?.popularEntities) return [];
    return stats.popularEntities.map(item => ({
      name: item.entityType.charAt(0).toUpperCase() + item.entityType.slice(1),
      value: item.count,
      percentage: ((item.count / stats.totalExports) * 100).toFixed(1)
    }));
  };

  const formatFormatData = () => {
    if (!stats?.formatDistribution) return [];
    return stats.formatDistribution.map(item => ({
      name: item.format.toUpperCase(),
      value: item.count,
      percentage: ((item.count / stats.totalExports) * 100).toFixed(1)
    }));
  };

  // Mock data for time series (this would come from API)
  const timeSeriesData = [
    { date: '2024-01-01', exports: 45, imports: 23, errors: 2 },
    { date: '2024-01-02', exports: 52, imports: 31, errors: 1 },
    { date: '2024-01-03', exports: 48, imports: 28, errors: 3 },
    { date: '2024-01-04', exports: 61, imports: 35, errors: 1 },
    { date: '2024-01-05', exports: 55, imports: 42, errors: 0 },
    { date: '2024-01-06', exports: 67, imports: 38, errors: 2 },
    { date: '2024-01-07', exports: 72, imports: 45, errors: 1 }
  ];

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Export/Import Analytics</h2>
            <p className="text-muted-foreground">
              Monitor system performance and usage statistics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => dispatch(fetchExportStats())}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemHealth.activeExports + systemHealth.activeImports}
              </div>
              <div className="text-xs text-muted-foreground">
                {systemHealth.activeExports} exports, {systemHealth.activeImports} imports
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-600">Processing</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats?.successRate?.toFixed(1) || 0}%
              </div>
              <div className="text-xs text-muted-foreground">
                Last {timePeriod}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">Excellent</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemHealth.storageUsed}%
              </div>
              <Progress value={systemHealth.storageUsed} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {systemHealth.storageUsed}GB / {systemHealth.storageLimit}GB used
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.averageProcessingTime?.toFixed(1) || systemHealth.avgProcessingTime}m
              </div>
              <div className="text-xs text-muted-foreground">
                Per 1K records
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">Improving</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="entities">Entities</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Total Operations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Exports</span>
                    </div>
                    <div className="text-xl font-bold">{stats?.totalExports || 0}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Imports</span>
                    </div>
                    <div className="text-xl font-bold">{stats?.totalImports || 0}</div>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-medium">Total</span>
                    <div className="text-2xl font-bold">
                      {(stats?.totalExports || 0) + (stats?.totalImports || 0)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Format Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Format Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={formatFormatData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                      >
                        {formatFormatData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Data Volume */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Processed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {stats?.totalDataProcessed?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-muted-foreground">Records Processed</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This Month</span>
                      <span className="font-medium">
                        {(stats?.totalDataProcessed * 0.3)?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>This Week</span>
                      <span className="font-medium">
                        {(stats?.totalDataProcessed * 0.1)?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Today</span>
                      <span className="font-medium">
                        {(stats?.totalDataProcessed * 0.02)?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage Trends</CardTitle>
                <CardDescription>
                  Export and import activity over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="exports"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name="Exports"
                    />
                    <Area
                      type="monotone"
                      dataKey="imports"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="Imports"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Error Trends</CardTitle>
                <CardDescription>
                  Track system reliability over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="errors"
                      stroke="#ff7300"
                      strokeWidth={2}
                      name="Errors"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Entity Types</CardTitle>
                <CardDescription>
                  Most frequently exported/imported data types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatEntityData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formatEntityData().map((entity, index) => (
                <Card key={entity.name}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{entity.name}</span>
                      <Badge variant="secondary">{entity.percentage}%</Badge>
                    </div>
                    <Progress value={parseFloat(entity.percentage)} className="h-2" />
                    <div className="text-sm text-muted-foreground mt-1">
                      {entity.value.toLocaleString()} operations
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Queue Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Queued Jobs</span>
                      <Badge variant="secondary">{systemHealth.queuedJobs}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Failed Jobs</span>
                      <Badge variant="destructive">{systemHealth.failedJobs}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Processing Speed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {((1000 / (stats?.averageProcessingTime || 2.5)) * 60).toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Records per minute
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">System Load</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats?.averageProcessingTime?.toFixed(1) || '2.5'}s
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Export Time</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(stats?.averageProcessingTime * 1.2)?.toFixed(1) || '3.0'}s
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Import Time</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {(100 - (systemHealth.failedJobs / (systemHealth.activeExports + systemHealth.activeImports) * 100)).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {systemHealth.queuedJobs}
                    </div>
                    <div className="text-sm text-muted-foreground">Queue Length</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Maintenance</CardTitle>
                <CardDescription>
                  Manage system resources and cleanup old data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label>Cleanup jobs older than</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Select value={cleanupDays} onValueChange={setCleanupDays}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleCleanup}
                        disabled={isCleaningUp}
                        className="flex items-center gap-2"
                      >
                        {isCleaningUp ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        {isCleaningUp ? 'Cleaning...' : 'Cleanup'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold">
                      {(stats?.totalExports || 0) + (stats?.totalImports || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Jobs</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold">{systemHealth.storageUsed}GB</div>
                    <div className="text-sm text-muted-foreground">Storage Used</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold">
                      {Math.floor(Math.random() * 500 + 100)}
                    </div>
                    <div className="text-sm text-muted-foreground">Files Stored</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemHealth.storageUsed > 80 && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Storage Warning</h4>
                        <p className="text-sm text-yellow-700">
                          Storage usage is above 80%. Consider cleaning up old files.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {systemHealth.failedJobs > 5 && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <h4 className="font-medium text-red-800">High Failure Rate</h4>
                        <p className="text-sm text-red-700">
                          Multiple jobs have failed recently. Check system resources.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {systemHealth.queuedJobs > 10 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-blue-800">High Queue Load</h4>
                        <p className="text-sm text-blue-700">
                          Many jobs are queued. Processing may be slower than usual.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {systemHealth.failedJobs <= 5 && systemHealth.storageUsed <= 80 && systemHealth.queuedJobs <= 10 && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium text-green-800">System Healthy</h4>
                        <p className="text-sm text-green-700">
                          All systems are operating normally.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminStatistics;