import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const AUTH_API_URL = "https://api-class-o1lo.onrender.com/api/khanhphuong/auth"; 
const USER_API_URL = "https://api-class-o1lo.onrender.com/api/khanhphuong/users"; // API User

// --- THUNK LOGIN (GIỮ NGUYÊN) ---
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData: any, thunkAPI) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/login`, userData);
      
      // Lưu thông tin cơ bản (bao gồm _id) vào LocalStorage
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('accessToken', response.data.data.accessToken);

      return response.data.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

// --- THUNK REGISTER (GIỮ NGUYÊN) ---
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

// --- 🔥 THUNK MỚI: LẤY USER THEO ID ---
export const fetchUserById = createAsyncThunk(
  'auth/fetchUserById',
  async (userId: string, thunkAPI) => {
    try {
      // Gọi API lấy chi tiết user theo ID
      // Endpoint dự kiến: GET /api/khanhphuong/users/:id
      const response = await axios.get(`${USER_API_URL}/${userId}`);

      // Backend thường trả về { data: { ...user info } } hoặc trực tiếp object
      // Bạn cần log response ra để xem cấu trúc chính xác nhé
      const freshUserData = response.data.data || response.data; 

      // Cập nhật lại LocalStorage để đồng bộ
      localStorage.setItem('user', JSON.stringify(freshUserData));
      
      return freshUserData; 
    } catch (error: any) {
      console.error("Lỗi fetch user:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi lấy thông tin user');
    }
  }
);

// --- INITIAL STATE ---
const localUser = localStorage.getItem('user');
const initialState = {
  user: localUser ? JSON.parse(localUser) : null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.clear();
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => { state.isLoading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => { state.isLoading = true; })
      .addCase(registerUser.fulfilled, (state) => { state.isLoading = false; })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 🔥 Fetch User By ID
      .addCase(fetchUserById.pending, (state) => { state.isLoading = true; })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // Cập nhật Store với dữ liệu mới nhất
      })
      .addCase(fetchUserById.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;