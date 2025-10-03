import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '@/services/api';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFilters {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  sortBy: string;
  sortOrder: string;
}

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
  filters: CategoryFilters;
}

const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    limit: 20,
    sortBy: 'sortOrder',
    sortOrder: 'asc',
  },
};

// Async thunks
export const createCategory = createAsyncThunk(
  'category/create',
  async (categoryData: {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    sortOrder?: number;
  }) => {
    const response = await categoryService.create(categoryData);
    return response;
  }
);

export const fetchCategories = createAsyncThunk(
  'category/fetchAll',
  async (filters: Partial<CategoryFilters>) => {
    const response = await categoryService.getAll(filters);
    return response;
  }
);

export const fetchCategoryById = createAsyncThunk(
  'category/fetchById',
  async (id: string) => {
    const response = await categoryService.getById(id);
    return response;
  }
);

export const updateCategory = createAsyncThunk(
  'category/update',
  async ({ id, data }: { 
    id: string; 
    data: {
      name?: string;
      description?: string;
      icon?: string;
      color?: string;
      isActive?: boolean;
      sortOrder?: number;
    }
  }) => {
    const response = await categoryService.update(id, data);
    return response;
  }
);

export const deleteCategory = createAsyncThunk(
  'category/delete',
  async (id: string) => {
    await categoryService.delete(id);
    return id;
  }
);

export const toggleCategoryStatus = createAsyncThunk(
  'category/toggleStatus',
  async (id: string) => {
    const response = await categoryService.toggleStatus(id);
    return response;
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    resetCategories: (state) => {
      state.categories = [];
      state.currentCategory = null;
      state.pagination = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data?.category) {
          state.categories.unshift(action.payload.data.category);
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create category';
      })
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data?.categories) {
          state.categories = action.payload.data.categories;
        }
        if (action.payload.data?.pagination) {
          state.pagination = action.payload.data.pagination;
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      // Fetch category by ID
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        if (action.payload.data?.category) {
          state.currentCategory = action.payload.data.category;
        }
      })
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data?.category) {
          const index = state.categories.findIndex(c => c._id === action.payload.data.category._id);
          if (index !== -1) {
            state.categories[index] = action.payload.data.category;
          }
          if (state.currentCategory?._id === action.payload.data.category._id) {
            state.currentCategory = action.payload.data.category;
          }
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update category';
      })
      // Delete category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload);
        if (state.currentCategory?._id === action.payload) {
          state.currentCategory = null;
        }
      })
      // Toggle category status
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        if (action.payload.data?.category) {
          const index = state.categories.findIndex(c => c._id === action.payload.data.category._id);
          if (index !== -1) {
            state.categories[index] = action.payload.data.category;
          }
          if (state.currentCategory?._id === action.payload.data.category._id) {
            state.currentCategory = action.payload.data.category;
          }
        }
      });
  },
});

export const { clearError, setFilters, clearCurrentCategory, resetCategories } = categorySlice.actions;
export default categorySlice.reducer;