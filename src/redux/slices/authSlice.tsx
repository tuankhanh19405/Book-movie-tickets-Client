import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- CẤU HÌNH API URL ---
const AUTH_API_URL = "https://api-class-o1lo.onrender.com/api/khanhphuong/auth";
const USER_API_URL = "https://api-class-o1lo.onrender.com/api/khanhphuong/users";

// --- 1. THUNK LOGIN (CÓ CHECK STATUS) ---
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData: any, thunkAPI) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/login`, userData);

      const user = response.data.data.user;
      const accessToken = response.data.data.accessToken;


      if (user.status === 'banned') {
        return thunkAPI.rejectWithValue('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với Phan Khanh để được giải quyết vấn đề nhanh nhất có thể nhé!!!');
      }

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);

      return user;

    } catch (error: any) {

      return thunkAPI.rejectWithValue(error.response?.data?.message || error || 'Đăng nhập thất bại');
    }
  }
);

// --- 2. THUNK REGISTER (AUTO ADD STATUS ACTIVE) ---
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: any, thunkAPI) => {
    try {

      const payload = {
        ...userData,
        status: 'active'
      };

      const response = await axios.post(`${AUTH_API_URL}/register`, payload);
      return response.data.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'auth/fetchUserById',
  async (userId: string, thunkAPI) => {
    try {
      const response = await axios.get(`${USER_API_URL}/${userId}`);
      const freshUserData = response.data.data || response.data;

      localStorage.setItem('user', JSON.stringify(freshUserData));
      return freshUserData;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi lấy thông tin user');
    }
  },
  {
    condition: (userId, { getState }) => {
      const state = getState() as any;
      const { user, isLoading } = state.auth;

      if (isLoading) return false;
      if (user && user._id === userId) return false;
      return true;
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userId, data }: { userId: string, data: any }, thunkAPI) => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.put(`${USER_API_URL}/${userId}`, data, config);
      const updatedUser = response.data.data || response.data;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Cập nhật thất bại');
    }
  }
);

// --- INITIAL STATE ---
const localUser = localStorage.getItem('user');
const initialState = {
  user: localUser ? JSON.parse(localUser) : null,
  isLoading: false,
  error: null as string | null,
};

// --- SLICE ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.isLoading = false; })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state) => {
        state.isLoading = false;
      })

      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;