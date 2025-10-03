import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  setExportModal,
  setImportModal,
  setBulkOperationModal,
  fetchExportHistory,
  fetchImportHistory
} from '../../store/slices/exportImportSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Button from '../ui/Button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Download,
  Upload,
  Package,
  FileText,
  BarChart3,
  Plus,
  History,
  Settings,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Import all the components we created
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';
import ProgressTracker from './ProgressTracker';
import TemplateManager from './TemplateManager';
import BulkOperations from './BulkOperations';
import AdminStatistics from './AdminStatistics';

interface ExportImportDashboardProps {
  userRole?: 'admin' | 'merchant' | 'user';
  className?: string;
}

const ExportImportDashboard: React.FC<ExportImportDashboardProps> = ({ 
  userRole = 'user', 
  className 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    exports: { jobs: exportJobs, activeJobs: activeExports },
    imports: { jobs: importJobs, activeJobs: activeImports },
    stats
  } = useSelector((state: RootState) => state.exportImport);

  useEffect(() => {
    // Fetch recent history
    dispatch(fetchExportHistory({ page: 1, limit: 10 }));
    dispatch(fetchImportHistory({ page: 1, limit: 10 }));
  }, [dispatch]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing':
        return <BarChart3 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800' },
      processing: { variant: 'default', className: 'bg-blue-100 text-blue-800' },
      completed: { variant: 'default', className: 'bg-green-100 text-green-800' },
      failed: { variant: 'destructive', className: '' }
    };

    const config = variants[status] || variants.pending;
    
    return (
      <Badge {...config}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  const activeOperationsCount = Object.keys(activeExports).length + Object.keys(activeImports).length;
  const recentExports = exportJobs.slice(0, 5);
  const recentImports = importJobs.slice(0, 5);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Export & Import</h1>
          <p className="text-muted-foreground">
            Manage your data exports, imports, and bulk operations
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => dispatch(setExportModal(true))}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button
            variant="outline"
            onClick={() => dispatch(setImportModal(true))}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import Data
          </Button>
          <Button
            variant="outline"
            onClick={() => dispatch(setBulkOperationModal(true))}
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Bulk Operations
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOperationsCount}</div>
            <div className="text-xs text-muted-foreground">
              {Object.keys(activeExports).length} exports, {Object.keys(activeImports).length} imports
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Exports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalExports || exportJobs.length}</div>
            <div className="text-xs text-muted-foreground">
              All time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Imports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalImports || importJobs.length}</div>
            <div className="text-xs text-muted-foreground">
              All time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.successRate?.toFixed(1) || '98.5'}%
            </div>
            <div className="text-xs text-muted-foreground">
              Last 30 days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Active Operations Tracker */}
        {activeOperationsCount > 0 && (
          <ProgressTracker />
        )}

        {/* Tabbed Interface */}
        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="templates">FileTexts</TabsTrigger>
            {userRole === 'admin' && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Exports */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Recent Exports
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <History className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </div>
                  <CardDescription>
                    Your latest data export operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentExports.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Download className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No exports yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => dispatch(setExportModal(true))}
                      >
                        Create your first export
                      </Button>
                    </div>
                  ) : (
                    recentExports.map((exportJob) => (
                      <div key={exportJob.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Download className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium capitalize">
                              {exportJob.entityType} Export
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {exportJob.format?.toUpperCase()} • {formatDistanceToNow(new Date(exportJob.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(exportJob.status)}
                          {exportJob.status === 'completed' && exportJob.downloadUrl && (
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Recent Imports */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Recent Imports
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <History className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </div>
                  <CardDescription>
                    Your latest data import operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentImports.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No imports yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => dispatch(setImportModal(true))}
                      >
                        Import your first file
                      </Button>
                    </div>
                  ) : (
                    recentImports.map((importJob) => (
                      <div key={importJob.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium capitalize">
                              {importJob.entityType} Import
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {importJob.fileName} • {formatDistanceToNow(new Date(importJob.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(importJob.status)}
                          {importJob.status === 'completed' && (
                            <div className="text-xs text-muted-foreground">
                              {importJob.successCount}/{importJob.totalRecords} success
                            </div>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>
                  Common export and import operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center gap-2"
                    onClick={() => dispatch(setExportModal(true))}
                  >
                    <Download className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Export Data</div>
                      <div className="text-xs text-muted-foreground">Create new export</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center gap-2"
                    onClick={() => dispatch(setImportModal(true))}
                  >
                    <Upload className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Import Data</div>
                      <div className="text-xs text-muted-foreground">Upload and import</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center gap-2"
                    onClick={() => dispatch(setBulkOperationModal(true))}
                  >
                    <Package className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Bulk Operations</div>
                      <div className="text-xs text-muted-foreground">Multiple files</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <TemplateManager />
          </TabsContent>

          {userRole === 'admin' && (
            <TabsContent value="analytics">
              <AdminStatistics />
            </TabsContent>
          )}

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Export/Import Settings
                </CardTitle>
                <CardDescription>
                  Configure your export and import preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Export Preferences</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Email notifications for completed exports</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Apply GDPR data sanitization</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">Compress large exports automatically</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Import Preferences</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Validate data before importing</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">Skip duplicate records automatically</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Email import summary reports</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">File Format Support</CardTitle>
                <CardDescription>
                  Supported file formats for export and import operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Download className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-medium">CSV</h4>
                    <p className="text-xs text-muted-foreground">Lightweight format</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Download className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-medium">Excel</h4>
                    <p className="text-xs text-muted-foreground">Rich formatting</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Download className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="font-medium">JSON</h4>
                    <p className="text-xs text-muted-foreground">Structured data</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Download className="h-8 w-8 mx-auto mb-2 text-red-600" />
                    <h4 className="font-medium">PDF</h4>
                    <p className="text-xs text-muted-foreground">Report format</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <ExportModal />
      <ImportModal />
      <BulkOperations />
    </div>
  );
};

export default ExportImportDashboard;