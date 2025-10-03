import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  exportImportService,
  ExportJob,
  ImportJob,
  ExportTemplate,
  ImportTemplate,
  ScheduledExport,
  ExportStats,
  ExportJobParams,
  ImportJobParams
} from '../../services/exportImport';

interface ExportImportState {
  // Export state
  exports: {
    jobs: ExportJob[];
    activeJobs: Record<string, ExportJob>;
    templates: ExportTemplate[];
    scheduled: ScheduledExport[];
    loading: boolean;
    error: string | null;
  };
  
  // Import state
  imports: {
    jobs: ImportJob[];
    activeJobs: Record<string, ImportJob>;
    templates: ImportTemplate[];
    loading: boolean;
    error: string | null;
  };
  
  // General state
  stats: ExportStats | null;
  supportedEntities: string[];
  supportedFormats: string[];
  
  // UI state
  ui: {
    exportModal: boolean;
    importModal: boolean;
    templateModal: boolean;
    scheduledExportModal: boolean;
    bulkOperationModal: boolean;
    selectedEntityType: string;
    selectedFormat: string;
  };
}

const initialState: ExportImportState = {
  exports: {
    jobs: [],
    activeJobs: {},
    templates: [],
    scheduled: [],
    loading: false,
    error: null,
  },
  imports: {
    jobs: [],
    activeJobs: {},
    templates: [],
    loading: false,
    error: null,
  },
  stats: null,
  supportedEntities: exportImportService.getSupportedEntityTypes(),
  supportedFormats: exportImportService.getSupportedFormats(),
  ui: {
    exportModal: false,
    importModal: false,
    templateModal: false,
    scheduledExportModal: false,
    bulkOperationModal: false,
    selectedEntityType: 'customers',
    selectedFormat: 'csv',
  },
};

// Export async thunks
export const createExport = createAsyncThunk(
  'exportImport/createExport',
  async (params: ExportJobParams) => {
    const response = await exportImportService.createExport(params);
    return response;
  }
);

export const fetchExportHistory = createAsyncThunk(
  'exportImport/fetchExportHistory',
  async (params?: { page?: number; limit?: number; status?: string; entityType?: string }) => {
    const response = await exportImportService.getExportHistory(params);
    return response;
  }
);

export const fetchExportStatus = createAsyncThunk(
  'exportImport/fetchExportStatus',
  async (exportJobId: string) => {
    const response = await exportImportService.getExportStatus(exportJobId);
    return response.data;
  }
);

export const downloadExport = createAsyncThunk(
  'exportImport/downloadExport',
  async (exportJobId: string) => {
    await exportImportService.downloadExport(exportJobId);
    return exportJobId;
  }
);

// Import async thunks
export const createImport = createAsyncThunk(
  'exportImport/createImport',
  async (params: ImportJobParams) => {
    const response = await exportImportService.createImport(params);
    return response;
  }
);

export const fetchImportHistory = createAsyncThunk(
  'exportImport/fetchImportHistory',
  async (params?: { page?: number; limit?: number; status?: string; entityType?: string }) => {
    const response = await exportImportService.getImportHistory(params);
    return response;
  }
);

export const fetchImportStatus = createAsyncThunk(
  'exportImport/fetchImportStatus',
  async (importJobId: string) => {
    const response = await exportImportService.getImportStatus(importJobId);
    return response.data;
  }
);

// Template async thunks
export const fetchExportTemplates = createAsyncThunk(
  'exportImport/fetchExportTemplates',
  async (entityType?: string) => {
    const response = await exportImportService.getExportTemplates(entityType);
    return response.data;
  }
);

export const createExportTemplate = createAsyncThunk(
  'exportImport/createExportTemplate',
  async (template: Omit<ExportTemplate, 'id' | 'createdBy' | 'createdAt'>) => {
    const response = await exportImportService.createExportTemplate(template);
    return response.data;
  }
);

export const fetchImportTemplates = createAsyncThunk(
  'exportImport/fetchImportTemplates',
  async (entityType?: string) => {
    const response = await exportImportService.getImportTemplates(entityType);
    return response.data;
  }
);

export const createImportTemplate = createAsyncThunk(
  'exportImport/createImportTemplate',
  async (template: Omit<ImportTemplate, 'id' | 'createdBy' | 'createdAt'>) => {
    const response = await exportImportService.createImportTemplate(template);
    return response.data;
  }
);

// Scheduled exports async thunks
export const fetchScheduledExports = createAsyncThunk(
  'exportImport/fetchScheduledExports',
  async () => {
    const response = await exportImportService.getScheduledExports();
    return response.data;
  }
);

export const createScheduledExport = createAsyncThunk(
  'exportImport/createScheduledExport',
  async (scheduledExport: Omit<ScheduledExport, 'id' | 'lastRun' | 'nextRun' | 'createdAt'>) => {
    const response = await exportImportService.createScheduledExport(scheduledExport);
    return response.data;
  }
);

// Stats async thunk
export const fetchExportStats = createAsyncThunk(
  'exportImport/fetchExportStats',
  async () => {
    const response = await exportImportService.getExportStats();
    return response.data;
  }
);

// Bulk operations async thunks
export const bulkExport = createAsyncThunk(
  'exportImport/bulkExport',
  async (params: { entityTypes: string[]; format: string }) => {
    const response = await exportImportService.bulkExport(params.entityTypes, params.format);
    return response;
  }
);

export const bulkImport = createAsyncThunk(
  'exportImport/bulkImport',
  async (files: { entityType: string; file: File; templateId?: string }[]) => {
    const response = await exportImportService.bulkImport(files);
    return response;
  }
);

const exportImportSlice = createSlice({
  name: 'exportImport',
  initialState,
  reducers: {
    // UI actions
    setExportModal: (state, action: PayloadAction<boolean>) => {
      state.ui.exportModal = action.payload;
    },
    setImportModal: (state, action: PayloadAction<boolean>) => {
      state.ui.importModal = action.payload;
    },
    setTemplateModal: (state, action: PayloadAction<boolean>) => {
      state.ui.templateModal = action.payload;
    },
    setScheduledExportModal: (state, action: PayloadAction<boolean>) => {
      state.ui.scheduledExportModal = action.payload;
    },
    setBulkOperationModal: (state, action: PayloadAction<boolean>) => {
      state.ui.bulkOperationModal = action.payload;
    },
    setSelectedEntityType: (state, action: PayloadAction<string>) => {
      state.ui.selectedEntityType = action.payload;
    },
    setSelectedFormat: (state, action: PayloadAction<string>) => {
      state.ui.selectedFormat = action.payload;
    },
    
    // Real-time updates
    updateExportProgress: (state, action: PayloadAction<{ jobId: string; progress: number; processedRecords: number }>) => {
      const { jobId, progress, processedRecords } = action.payload;
      if (state.exports.activeJobs[jobId]) {
        state.exports.activeJobs[jobId].progress = progress;
        state.exports.activeJobs[jobId].processedRecords = processedRecords;
      }
    },
    
    updateImportProgress: (state, action: PayloadAction<{ jobId: string; progress: number; processedRecords: number; successCount: number; errorCount: number }>) => {
      const { jobId, progress, processedRecords, successCount, errorCount } = action.payload;
      if (state.imports.activeJobs[jobId]) {
        state.imports.activeJobs[jobId].progress = progress;
        state.imports.activeJobs[jobId].processedRecords = processedRecords;
        state.imports.activeJobs[jobId].successCount = successCount;
        state.imports.activeJobs[jobId].errorCount = errorCount;
      }
    },
    
    markExportCompleted: (state, action: PayloadAction<{ jobId: string; downloadUrl: string }>) => {
      const { jobId, downloadUrl } = action.payload;
      if (state.exports.activeJobs[jobId]) {
        state.exports.activeJobs[jobId].status = 'completed';
        state.exports.activeJobs[jobId].progress = 100;
        state.exports.activeJobs[jobId].downloadUrl = downloadUrl;
        state.exports.activeJobs[jobId].completedAt = new Date().toISOString();
      }
    },
    
    markImportCompleted: (state, action: PayloadAction<{ jobId: string }>) => {
      const { jobId } = action.payload;
      if (state.imports.activeJobs[jobId]) {
        state.imports.activeJobs[jobId].status = 'completed';
        state.imports.activeJobs[jobId].progress = 100;
        state.imports.activeJobs[jobId].completedAt = new Date().toISOString();
      }
    },
    
    markExportFailed: (state, action: PayloadAction<{ jobId: string; errorMessage: string }>) => {
      const { jobId, errorMessage } = action.payload;
      if (state.exports.activeJobs[jobId]) {
        state.exports.activeJobs[jobId].status = 'failed';
        state.exports.activeJobs[jobId].errorMessage = errorMessage;
      }
    },
    
    markImportFailed: (state, action: PayloadAction<{ jobId: string; errorMessage: string }>) => {
      const { jobId, errorMessage } = action.payload;
      if (state.imports.activeJobs[jobId]) {
        state.imports.activeJobs[jobId].status = 'failed';
        state.imports.activeJobs[jobId].errorMessage = errorMessage;
      }
    },
    
    // Clear states
    clearExportError: (state) => {
      state.exports.error = null;
    },
    
    clearImportError: (state) => {
      state.imports.error = null;
    },
    
    removeActiveExportJob: (state, action: PayloadAction<string>) => {
      delete state.exports.activeJobs[action.payload];
    },
    
    removeActiveImportJob: (state, action: PayloadAction<string>) => {
      delete state.imports.activeJobs[action.payload];
    },
  },
  extraReducers: (builder) => {
    // Export reducers
    builder
      .addCase(createExport.pending, (state) => {
        state.exports.loading = true;
        state.exports.error = null;
      })
      .addCase(createExport.fulfilled, (state, action) => {
        state.exports.loading = false;
        // Create a placeholder job for tracking
        const jobId = action.payload.exportJobId;
        state.exports.activeJobs[jobId] = {
          id: jobId,
          entityType: state.ui.selectedEntityType,
          format: state.ui.selectedFormat,
          status: 'pending',
          progress: 0,
          totalRecords: 0,
          processedRecords: 0,
          createdAt: new Date().toISOString(),
        };
      })
      .addCase(createExport.rejected, (state, action) => {
        state.exports.loading = false;
        state.exports.error = action.error.message || 'Failed to create export';
      })
      
      .addCase(fetchExportHistory.fulfilled, (state, action) => {
        state.exports.jobs = action.payload.data;
      })
      
      .addCase(fetchExportStatus.fulfilled, (state, action) => {
        const job = action.payload;
        state.exports.activeJobs[job.id] = job;
      })
      
      // Import reducers
      .addCase(createImport.pending, (state) => {
        state.imports.loading = true;
        state.imports.error = null;
      })
      .addCase(createImport.fulfilled, (state, action) => {
        state.imports.loading = false;
        const jobId = action.payload.importJobId;
        state.imports.activeJobs[jobId] = {
          id: jobId,
          entityType: state.ui.selectedEntityType,
          status: 'pending',
          progress: 0,
          totalRecords: 0,
          processedRecords: 0,
          successCount: 0,
          errorCount: 0,
          errors: [],
          fileName: 'uploaded_file',
          createdAt: new Date().toISOString(),
        };
      })
      .addCase(createImport.rejected, (state, action) => {
        state.imports.loading = false;
        state.imports.error = action.error.message || 'Failed to create import';
      })
      
      .addCase(fetchImportHistory.fulfilled, (state, action) => {
        state.imports.jobs = action.payload.data;
      })
      
      .addCase(fetchImportStatus.fulfilled, (state, action) => {
        const job = action.payload;
        state.imports.activeJobs[job.id] = job;
      })
      
      // Template reducers
      .addCase(fetchExportTemplates.fulfilled, (state, action) => {
        state.exports.templates = action.payload;
      })
      
      .addCase(createExportTemplate.fulfilled, (state, action) => {
        state.exports.templates.push(action.payload);
      })
      
      .addCase(fetchImportTemplates.fulfilled, (state, action) => {
        state.imports.templates = action.payload;
      })
      
      .addCase(createImportTemplate.fulfilled, (state, action) => {
        state.imports.templates.push(action.payload);
      })
      
      // Scheduled exports reducers
      .addCase(fetchScheduledExports.fulfilled, (state, action) => {
        state.exports.scheduled = action.payload;
      })
      
      .addCase(createScheduledExport.fulfilled, (state, action) => {
        state.exports.scheduled.push(action.payload);
      })
      
      // Stats reducers
      .addCase(fetchExportStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const {
  setExportModal,
  setImportModal,
  setTemplateModal,
  setScheduledExportModal,
  setBulkOperationModal,
  setSelectedEntityType,
  setSelectedFormat,
  updateExportProgress,
  updateImportProgress,
  markExportCompleted,
  markImportCompleted,
  markExportFailed,
  markImportFailed,
  clearExportError,
  clearImportError,
  removeActiveExportJob,
  removeActiveImportJob,
} = exportImportSlice.actions;

export default exportImportSlice.reducer;