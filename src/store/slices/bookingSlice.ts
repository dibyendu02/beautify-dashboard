import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '@/services/api';
import { Booking, BookingFilters } from '@/types';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
  filters: BookingFilters;
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'appointmentDate',
    sortOrder: 'desc',
  },
  stats: {
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  },
};

// Async thunks
export const fetchBookings = createAsyncThunk(
  'booking/fetchAll',
  async (filters: BookingFilters) => {
    const response = await bookingService.getAll(filters);
    return response;
  }
);

export const fetchBookingById = createAsyncThunk(
  'booking/fetchById',
  async (id: string) => {
    const response = await bookingService.getById(id);
    return response;
  }
);

export const updateBookingStatus = createAsyncThunk(
  'booking/updateStatus',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await bookingService.updateStatus(id, status);
    return { id, booking: response.booking };
  }
);

export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData: any) => {
    const response = await bookingService.create(bookingData);
    return response;
  }
);

export const updateBooking = createAsyncThunk(
  'booking/update',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await bookingService.update(id, data);
    return { id, booking: response.booking };
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async ({ id, reason }: { id: string; reason: string }) => {
    const response = await bookingService.cancel(id, reason);
    return { id, booking: response.booking };
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    updateStats: (state) => {
      const stats = state.bookings.reduce(
        (acc, booking) => {
          acc.total++;
          acc[booking.status as keyof typeof acc]++;
          return acc;
        },
        { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
      );
      state.stats = stats;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.data.bookings;
        state.pagination = action.payload.data.pagination;
        // Update stats
        const stats = action.payload.data.bookings.reduce(
          (acc: any, booking: Booking) => {
            acc.total++;
            if (acc[booking.status] !== undefined) {
              acc[booking.status]++;
            }
            return acc;
          },
          { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
        );
        state.stats = stats;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      })
      // Fetch booking by ID
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.currentBooking = action.payload.booking;
      })
      // Update booking status
      .addCase(updateBookingStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload.booking;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update booking status';
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.unshift(action.payload.booking);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create booking';
      })
      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload.booking;
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update booking';
      })
      // Cancel booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload.booking;
        }
      });
  },
});

export const { clearError, setFilters, clearCurrentBooking, updateStats } = bookingSlice.actions;
export default bookingSlice.reducer;