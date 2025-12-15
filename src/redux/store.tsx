import { configureStore, combineReducers } from '@reduxjs/toolkit';
import movieReducer from './slices/movieSlice';
import bookingReducer from './slices/bookingSlice';
import authReducer from './slices/authSlice'; 
import showtimeReducer from './slices/showtimeSlice'
import { 
  persistStore, 
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER 
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // ❌ Đã xóa 'auth' khỏi whitelist
  // ✅ Chỉ để lại 'movies' (hoặc các slice khác bạn muốn persist tự động)
  whitelist: ['movies'] 
};

const rootReducer = combineReducers({
  movies: movieReducer,
  booking: bookingReducer,
  auth: authReducer, 
  showtimes: showtimeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;