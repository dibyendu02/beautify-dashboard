import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { serviceService } from '@/services/api';
import { Service, ServiceFilters, ApiResponse } from '@/types';

interface ServiceState {
  services: Service[];
  currentService: Service | null;
  categories: string[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
  filters: ServiceFilters;
}

const initialState: ServiceState = {
  services: [],
  currentService: null,
  categories: [],
  isLoading: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

// Async thunks
export const createService = createAsyncThunk(
  'service/create',
  async (serviceData: any) => {
    const response = await serviceService.create(serviceData);
    return response;
  }
);

export const fetchServices = createAsyncThunk(
  'service/fetchAll',
  async (filters: ServiceFilters) => {
    const response = await serviceService.getAll(filters);
    return response;
  }
);

export const fetchServiceById = createAsyncThunk(
  'service/fetchById',
  async (id: string) => {
    const response = await serviceService.getById(id);
    return response;
  }
);

export const updateService = createAsyncThunk(
  'service/update',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await serviceService.update(id, data);
    return response;
  }
);

export const deleteService = createAsyncThunk(
  'service/delete',
  async (id: string) => {
    await serviceService.delete(id);
    return id;
  }
);

export const fetchCategories = createAsyncThunk(
  'service/fetchCategories',
  async () => {
    const response = await serviceService.getCategories();
    return response;
  }
);

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentService: (state) => {
      state.currentService = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create service
      .addCase(createService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services.unshift(action.payload.service);
      })
      .addCase(createService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create service';
      })
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload.data.services;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch services';
      })
      // Fetch service by ID
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.currentService = action.payload.service;
      })
      // Update service
      .addCase(updateService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.services.findIndex(s => s.id === action.payload.service.id);
        if (index !== -1) {
          state.services[index] = action.payload.service;
        }
        if (state.currentService?.id === action.payload.service.id) {
          state.currentService = action.payload.service;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update service';
      })
      // Delete service
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter(s => s.id !== action.payload);
        if (state.currentService?.id === action.payload) {
          state.currentService = null;
        }
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data.categories;
      });
  },
});

export const { clearError, setFilters, clearCurrentService } = serviceSlice.actions;
export default serviceSlice.reducer;