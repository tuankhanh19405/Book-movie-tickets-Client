import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- CẤU HÌNH API URL ---
const AUTH_API_URL = "https://api-class-o1lo.onrender.com/api/khanhphuong/auth"; 
const USER_API_URL = "https://api-class-o1lo.onrender.com/api/khanhphuong/users"; // API User collection

// --- 1. THUNK LOGIN (ĐĂNG NHẬP) ---
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData: any, thunkAPI) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/login`, userData);
      
      // Lưu thông tin user và token vào LocalStorage
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('accessToken', response.data.data.accessToken);

      return response.data.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

// --- 2. THUNK REGISTER (ĐĂNG KÝ) ---
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: any, thunkAPI) => {
      try {
        const response = await axios.post(`${AUTH_API_URL}/register`, userData);
        return response.data.data.user;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
      }
    }
);

// --- 3. THUNK LẤY USER THEO ID (GET) ---
export const fetchUserById = createAsyncThunk(
  'auth/fetchUserById',
  async (userId: string, thunkAPI) => {
    try {
      const response = await axios.get(`${USER_API_URL}/${userId}`);
      const freshUserData = response.data.data || response.data; 

      // Cập nhật lại LocalStorage để dữ liệu luôn mới nhất
      localStorage.setItem('user', JSON.stringify(freshUserData));
      
      return freshUserData; 
    } catch (error: any) {
      console.error("Lỗi fetch user:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi lấy thông tin user');
    }
  }
);

// --- 4. THUNK CẬP NHẬT THÔNG TIN USER (PUT) - ĐÃ SỬA LỖI ---
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userId, data }: { userId: string, data: any }, thunkAPI) => {
    try {
      // BƯỚC QUAN TRỌNG: Lấy Token từ LocalStorage
      const token = localStorage.getItem('accessToken');

      // Tạo cấu hình Header chứa Token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`, // Gửi Token lên để xác thực quyền chủ sở hữu
          'Content-Type': 'application/json'
        }
      };

      // Gọi API PUT với config đã có Token
      const response = await axios.put(`${USER_API_URL}/${userId}`, data, config);
      
      // Lấy dữ liệu user mới sau khi update thành công
      const updatedUser = response.data.data || response.data;

      // Cập nhật lại LocalStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error: any) {
      console.error("Lỗi cập nhật API:", error.response?.data);
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
      .addCase(fetchUserById.pending, (state) => { state.isLoading = true; })
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
        state.user = action.payload; // Cập nhật store ngay lập tức
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;