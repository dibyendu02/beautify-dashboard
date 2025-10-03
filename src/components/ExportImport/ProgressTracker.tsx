import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  updateExportProgress,
  updateImportProgress,
  markExportCompleted,
  markImportCompleted,
  markExportFailed,
  markImportFailed,
  removeActiveExportJob,
  removeActiveImportJob
} from '../../store/slices/exportImportSlice';
import { exportImportService } from '../../services/exportImport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Button from '../ui/Button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  AlertCircle,
  FileText,
  Users,
  Database,
  BarChart3
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface ProgressTrackerProps {
  className?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { exports, imports } = useSelector((state: RootState) => state.exportImport);

  useEffect(() => {
    // Connect to WebSocket for real-time updates
    const token = localStorage.getItem('authToken');
    if (token) {
      exportImportService.connectWebSocket(token);

      // Export event listeners
      const handleExportProgress = (data: any) => {
        dispatch(updateExportProgress({
          jobId: data.jobId,
          progress: data.progress,
          processedRecords: data.processedRecords
        }));
      };

      const handleExportCompleted = (data: any) => {
        dispatch(markExportCompleted({
          jobId: data.jobId,
          downloadUrl: data.downloadUrl
        }));
        toast.success(`Export "${data.jobId}" completed successfully!`);
      };

      const handleExportFailed = (data: any) => {
        dispatch(markExportFailed({
          jobId: data.jobId,
          errorMessage: data.errorMessage
        }));
        toast.error(`Export "${data.jobId}" failed: ${data.errorMessage}`);
      };

      // Import event listeners
      const handleImportProgress = (data: any) => {
        dispatch(updateImportProgress({
          jobId: data.jobId,
          progress: data.progress,
          processedRecords: data.processedRecords,
          successCount: data.successCount,
          errorCount: data.errorCount
        }));
      };

      const handleImportCompleted = (data: any) => {
        dispatch(markImportCompleted({
          jobId: data.jobId
        }));
        toast.success(`Import "${data.jobId}" completed successfully!`);
      };

      const handleImportFailed = (data: any) => {
        dispatch(markImportFailed({
          jobId: data.jobId,
          errorMessage: data.errorMessage
        }));
        toast.error(`Import "${data.jobId}" failed: ${data.errorMessage}`);
      };

      // Register event listeners
      exportImportService.onExportProgress(handleExportProgress);
      exportImportService.onExportCompleted(handleExportCompleted);
      exportImportService.onExportFailed(handleExportFailed);
      exportImportService.onImportProgress(handleImportProgress);
      exportImportService.onImportCompleted(handleImportCompleted);
      exportImportService.onImportFailed(handleImportFailed);

      return () => {
        // Cleanup event listeners
        exportImportService.offExportProgress(handleExportProgress);
        exportImportService.offExportCompleted(handleExportCompleted);
        exportImportService.offExportFailed(handleExportFailed);
        exportImportService.offImportProgress(handleImportProgress);
        exportImportService.offImportCompleted(handleImportCompleted);
        exportImportService.offImportFailed(handleImportFailed);
        exportImportService.disconnectWebSocket();
      };
    }
  }, [dispatch]);

  const handleDownload = async (jobId: string) => {
    try {
      await exportImportService.downloadExport(jobId);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download export');
    }
  };

  const handleRemoveJob = (jobId: string, type: 'export' | 'import') => {
    if (type === 'export') {
      dispatch(removeActiveExportJob(jobId));
    } else {
      dispatch(removeActiveImportJob(jobId));
    }
  };

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

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const activeExports = Object.values(exports.activeJobs);
  const activeImports = Object.values(imports.activeJobs);

  if (activeExports.length === 0 && activeImports.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-8 w-8 mx-auto mb-2" />
            <p>No active exports or imports</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Active Exports */}
      {activeExports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5" />
              Active Exports ({activeExports.length})
            </CardTitle>
            <CardDescription>
              Track your data export operations in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeExports.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">
                        {job.entityType.charAt(0).toUpperCase() + job.entityType.slice(1)} Export
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {job.format.toUpperCase()} • Started {formatTimeAgo(job.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(job.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveJob(job.id, 'export')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {job.status === 'processing' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {job.processedRecords.toLocaleString()} / {job.totalRecords.toLocaleString()} records
                      </span>
                      {job.processedRecords > 0 && job.totalRecords > 0 && (
                        <span>
                          ~{Math.round((job.totalRecords - job.processedRecords) / (job.processedRecords / (Date.now() - new Date(job.createdAt).getTime()) * 1000) / 60)} min remaining
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {job.status === 'completed' && job.downloadUrl && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleDownload(job.id)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Ready for download
                    </span>
                  </div>
                )}

                {job.status === 'failed' && job.errorMessage && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{job.errorMessage}</span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Active Imports */}
      {activeImports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Active Imports ({activeImports.length})
            </CardTitle>
            <CardDescription>
              Monitor your data import operations and validation results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeImports.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">
                        {job.entityType.charAt(0).toUpperCase() + job.entityType.slice(1)} Import
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {job.fileName} • Started {formatTimeAgo(job.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(job.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveJob(job.id, 'import')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {job.status === 'processing' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                      <div className="text-center">
                        <div className="font-medium text-sm">{job.processedRecords.toLocaleString()}</div>
                        <div>Processed</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-sm text-green-600">{job.successCount.toLocaleString()}</div>
                        <div>Success</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-sm text-red-600">{job.errorCount.toLocaleString()}</div>
                        <div>Errors</div>
                      </div>
                    </div>
                  </div>
                )}

                {job.status === 'completed' && (
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-medium">{job.totalRecords.toLocaleString()}</div>
                      <div className="text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-medium text-green-600">{job.successCount.toLocaleString()}</div>
                      <div className="text-muted-foreground">Imported</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <div className="font-medium text-red-600">{job.errorCount.toLocaleString()}</div>
                      <div className="text-muted-foreground">Failed</div>
                    </div>
                  </div>
                )}

                {job.status === 'failed' && job.errorMessage && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{job.errorMessage}</span>
                  </div>
                )}

                {job.errors && job.errors.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-red-600">
                      Validation Errors ({job.errors.length})
                    </h5>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {job.errors.slice(0, 5).map((error, index) => (
                        <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          Row {error.row}: {error.field} - {error.message}
                        </div>
                      ))}
                      {job.errors.length > 5 && (
                        <div className="text-xs text-muted-foreground">
                          ... and {job.errors.length - 5} more errors
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressTracker;