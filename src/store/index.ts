import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import merchantSlice from './slices/merchantSlice';
import serviceSlice from './slices/serviceSlice';
import bookingSlice from './slices/bookingSlice';
import categorySlice from './slices/categorySlice';
import uiSlice from './slices/uiSlice';
import exportImportSlice from './slices/exportImportSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    merchant: merchantSlice,
    service: serviceSlice,
    booking: bookingSlice,
    category: categorySlice,
    ui: uiSlice,
    exportImport: exportImportSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;