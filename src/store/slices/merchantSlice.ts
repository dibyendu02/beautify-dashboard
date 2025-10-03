import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { merchantService } from '@/services/api';
import { Merchant } from '@/types';

interface MerchantState {
  profile: Merchant | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MerchantState = {
  profile: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const createMerchantProfile = createAsyncThunk(
  'merchant/create',
  async (merchantData: any) => {
    const response = await merchantService.create(merchantData);
    return response;
  }
);

export const getMerchantProfile = createAsyncThunk(
  'merchant/getProfile',
  async () => {
    const response = await merchantService.getProfile();
    return response;
  }
);

export const updateMerchantProfile = createAsyncThunk(
  'merchant/update',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await merchantService.update(id, data);
    return response;
  }
);

const merchantSlice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create merchant profile
      .addCase(createMerchantProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMerchantProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.merchant;
      })
      .addCase(createMerchantProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create merchant profile';
      })
      // Get merchant profile
      .addCase(getMerchantProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMerchantProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.merchant;
      })
      .addCase(getMerchantProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch merchant profile';
      })
      // Update merchant profile
      .addCase(updateMerchantProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMerchantProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.merchant;
      })
      .addCase(updateMerchantProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update merchant profile';
      });
  },
});

export const { clearError } = merchantSlice.actions;
export default merchantSlice.reducer;