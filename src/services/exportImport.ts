import { api } from './api';
import { io, Socket } from 'socket.io-client';

// Types
export interface ExportJobParams {
  entityType: string;
  format: 'csv' | 'excel' | 'json' | 'pdf';
  filters?: Record<string, any>;
  fields?: string[];
  emailDelivery?: boolean;
  customName?: string;
  templateId?: string;
}

export interface ImportJobParams {
  entityType: string;
  templateId?: string;
  validateOnly?: boolean;
  file: File;
}

export interface ExportJob {
  id: string;
  entityType: string;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  fileName?: string;
  downloadUrl?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
  filters?: Record<string, any>;
  fields?: string[];
}

export interface ImportJob {
  id: string;
  entityType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  successCount: number;
  errorCount: number;
  errors: ImportError[];
  fileName: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
  templateId?: string;
}

export interface ImportError {
  row: number;
  field: string;
  value: any;
  message: string;
  severity: 'error' | 'warning';
}

export interface ExportTemplate {
  id: string;
  name: string;
  description?: string;
  entityType: string;
  fields: string[];
  defaultFilters?: Record<string, any>;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

export interface ImportTemplate {
  id: string;
  name: string;
  description?: string;
  entityType: string;
  fieldMapping: Record<string, string>;
  validationRules: Record<string, any>;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

export interface ScheduledExport {
  id: string;
  name: string;
  entityType: string;
  format: string;
  schedule: string;
  filters?: Record<string, any>;
  fields?: string[];
  emailRecipients: string[];
  isActive: boolean;
  lastRun?: string;
  nextRun: string;
  createdAt: string;
}

export interface ExportStats {
  totalExports: number;
  totalImports: number;
  successRate: number;
  popularEntities: { entityType: string; count: number }[];
  formatDistribution: { format: string; count: number }[];
  averageProcessingTime: number;
  totalDataProcessed: number;
}

// WebSocket Manager for real-time updates
class ExportImportWebSocket {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000', {
      auth: { token },
      transports: ['websocket']
    });

    this.socket.on('export:progress', (data) => {
      this.emit('export:progress', data);
    });

    this.socket.on('export:completed', (data) => {
      this.emit('export:completed', data);
    });

    this.socket.on('export:failed', (data) => {
      this.emit('export:failed', data);
    });

    this.socket.on('import:progress', (data) => {
      this.emit('import:progress', data);
    });

    this.socket.on('import:completed', (data) => {
      this.emit('import:completed', data);
    });

    this.socket.on('import:failed', (data) => {
      this.emit('import:failed', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }
}

export const wsManager = new ExportImportWebSocket();

// Export/Import Service
export const exportImportService = {
  // Export operations
  createExport: async (params: ExportJobParams): Promise<{ exportJobId: string }> => {
    const response = await api.post('/v1/export-import/export', params);
    return response.data;
  },

  getExportStatus: async (exportJobId: string): Promise<{ data: ExportJob }> => {
    const response = await api.get(`/v1/export-import/export/${exportJobId}/status`);
    return response.data;
  },

  downloadExport: async (exportJobId: string): Promise<void> => {
    const response = await api.get(`/v1/export-import/export/${exportJobId}/download`, {
      responseType: 'blob'
    });
    
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : 'export.csv';
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  getExportHistory: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    entityType?: string;
  }): Promise<{ data: ExportJob[]; pagination: any }> => {
    const response = await api.get('/v1/export-import/exports', { params });
    return response.data;
  },

  deleteExport: async (exportJobId: string): Promise<void> => {
    await api.delete(`/v1/export-import/export/${exportJobId}`);
  },

  // Import operations
  createImport: async (params: ImportJobParams): Promise<{ importJobId: string }> => {
    const formData = new FormData();
    formData.append('entityType', params.entityType);
    formData.append('file', params.file);
    
    if (params.templateId) {
      formData.append('templateId', params.templateId);
    }
    
    if (params.validateOnly !== undefined) {
      formData.append('validateOnly', params.validateOnly.toString());
    }

    const response = await api.post('/v1/export-import/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getImportStatus: async (importJobId: string): Promise<{ data: ImportJob }> => {
    const response = await api.get(`/v1/export-import/import/${importJobId}/status`);
    return response.data;
  },

  getImportHistory: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    entityType?: string;
  }): Promise<{ data: ImportJob[]; pagination: any }> => {
    const response = await api.get('/v1/export-import/imports', { params });
    return response.data;
  },

  deleteImport: async (importJobId: string): Promise<void> => {
    await api.delete(`/v1/export-import/import/${importJobId}`);
  },

  // Template operations
  getExportTemplates: async (entityType?: string): Promise<{ data: ExportTemplate[] }> => {
    const response = await api.get('/v1/export-import/templates/export', {
      params: entityType ? { entityType } : undefined
    });
    return response.data;
  },

  createExportTemplate: async (template: Omit<ExportTemplate, 'id' | 'createdBy' | 'createdAt'>): Promise<{ data: ExportTemplate }> => {
    const response = await api.post('/v1/export-import/templates/export', template);
    return response.data;
  },

  updateExportTemplate: async (id: string, template: Partial<ExportTemplate>): Promise<{ data: ExportTemplate }> => {
    const response = await api.put(`/v1/export-import/templates/export/${id}`, template);
    return response.data;
  },

  deleteExportTemplate: async (id: string): Promise<void> => {
    await api.delete(`/v1/export-import/templates/export/${id}`);
  },

  getImportTemplates: async (entityType?: string): Promise<{ data: ImportTemplate[] }> => {
    const response = await api.get('/v1/export-import/templates/import', {
      params: entityType ? { entityType } : undefined
    });
    return response.data;
  },

  createImportTemplate: async (template: Omit<ImportTemplate, 'id' | 'createdBy' | 'createdAt'>): Promise<{ data: ImportTemplate }> => {
    const response = await api.post('/v1/export-import/templates/import', template);
    return response.data;
  },

  updateImportTemplate: async (id: string, template: Partial<ImportTemplate>): Promise<{ data: ImportTemplate }> => {
    const response = await api.put(`/v1/export-import/templates/import/${id}`, template);
    return response.data;
  },

  deleteImportTemplate: async (id: string): Promise<void> => {
    await api.delete(`/v1/export-import/templates/import/${id}`);
  },

  generateImportTemplate: async (entityType: string): Promise<void> => {
    const response = await api.get(`/v1/export-import/templates/import/${entityType}/generate`, {
      responseType: 'blob'
    });
    
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${entityType}_import_template.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Scheduled exports
  getScheduledExports: async (): Promise<{ data: ScheduledExport[] }> => {
    const response = await api.get('/v1/export-import/scheduled-exports');
    return response.data;
  },

  createScheduledExport: async (scheduledExport: Omit<ScheduledExport, 'id' | 'lastRun' | 'nextRun' | 'createdAt'>): Promise<{ data: ScheduledExport }> => {
    const response = await api.post('/v1/export-import/scheduled-exports', scheduledExport);
    return response.data;
  },

  updateScheduledExport: async (id: string, scheduledExport: Partial<ScheduledExport>): Promise<{ data: ScheduledExport }> => {
    const response = await api.put(`/v1/export-import/scheduled-exports/${id}`, scheduledExport);
    return response.data;
  },

  deleteScheduledExport: async (id: string): Promise<void> => {
    await api.delete(`/v1/export-import/scheduled-exports/${id}`);
  },

  // Bulk operations
  bulkExport: async (entityTypes: string[], format: string): Promise<{ exportJobId: string }> => {
    const response = await api.post('/v1/export-import/bulk-export', {
      entityTypes,
      format
    });
    return response.data;
  },

  bulkImport: async (files: { entityType: string; file: File; templateId?: string }[]): Promise<{ importJobIds: string[] }> => {
    const formData = new FormData();
    
    files.forEach((item, index) => {
      formData.append(`files[${index}][entityType]`, item.entityType);
      formData.append(`files[${index}][file]`, item.file);
      if (item.templateId) {
        formData.append(`files[${index}][templateId]`, item.templateId);
      }
    });

    const response = await api.post('/v1/export-import/bulk-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Admin operations
  getExportStats: async (): Promise<{ data: ExportStats }> => {
    const response = await api.get('/v1/export-import/admin/export-stats');
    return response.data;
  },

  cleanupOldJobs: async (days: number): Promise<{ deleted: number }> => {
    const response = await api.delete(`/v1/export-import/admin/cleanup?days=${days}`);
    return response.data;
  },

  // Utility functions
  getSupportedEntityTypes: (): string[] => {
    return [
      'users',
      'customers',
      'merchants',
      'services',
      'bookings',
      'products',
      'reviews',
      'orders',
      'payments'
    ];
  },

  getSupportedFormats: (): string[] => {
    return ['csv', 'excel', 'json', 'pdf'];
  },

  getEntityFields: (entityType: string): string[] => {
    const fieldMapping: Record<string, string[]> = {
      users: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt', 'lastLogin'],
      customers: ['id', 'email', 'name', 'phone', 'dateOfBirth', 'gender', 'address', 'isActive', 'createdAt'],
      merchants: ['id', 'businessName', 'email', 'phone', 'address', 'category', 'rating', 'isVerified', 'createdAt'],
      services: ['id', 'name', 'description', 'price', 'duration', 'category', 'merchantId', 'isActive', 'createdAt'],
      bookings: ['id', 'customerId', 'merchantId', 'serviceId', 'dateTime', 'status', 'totalAmount', 'createdAt'],
      products: ['id', 'name', 'description', 'price', 'category', 'stock', 'merchantId', 'isActive', 'createdAt'],
      reviews: ['id', 'customerId', 'merchantId', 'rating', 'comment', 'isVerified', 'createdAt'],
      orders: ['id', 'customerId', 'merchantId', 'status', 'totalAmount', 'items', 'createdAt'],
      payments: ['id', 'bookingId', 'orderId', 'amount', 'status', 'paymentMethod', 'transactionId', 'createdAt']
    };
    
    return fieldMapping[entityType] || [];
  },

  // WebSocket management
  connectWebSocket: (token: string) => {
    wsManager.connect(token);
  },

  disconnectWebSocket: () => {
    wsManager.disconnect();
  },

  onExportProgress: (callback: (data: any) => void) => {
    wsManager.on('export:progress', callback);
  },

  onExportCompleted: (callback: (data: any) => void) => {
    wsManager.on('export:completed', callback);
  },

  onExportFailed: (callback: (data: any) => void) => {
    wsManager.on('export:failed', callback);
  },

  onImportProgress: (callback: (data: any) => void) => {
    wsManager.on('import:progress', callback);
  },

  onImportCompleted: (callback: (data: any) => void) => {
    wsManager.on('import:completed', callback);
  },

  onImportFailed: (callback: (data: any) => void) => {
    wsManager.on('import:failed', callback);
  },

  offExportProgress: (callback: (data: any) => void) => {
    wsManager.off('export:progress', callback);
  },

  offExportCompleted: (callback: (data: any) => void) => {
    wsManager.off('export:completed', callback);
  },

  offExportFailed: (callback: (data: any) => void) => {
    wsManager.off('export:failed', callback);
  },

  offImportProgress: (callback: (data: any) => void) => {
    wsManager.off('import:progress', callback);
  },

  offImportCompleted: (callback: (data: any) => void) => {
    wsManager.off('import:completed', callback);
  },

  offImportFailed: (callback: (data: any) => void) => {
    wsManager.off('import:failed', callback);
  }
};