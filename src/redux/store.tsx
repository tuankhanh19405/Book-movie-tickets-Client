import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './slices/movieSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    booking: bookingReducer,
  },
});

// Lấy type cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;