import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Showtime } from '../../interfaces/type';

const API_URL = "https://api-class-o1lo.onrender.com/api/khanhphuong/showtimes";


// Thunk: Lấy danh sách lịch chiếu
export const fetchShowtimes = createAsyncThunk(
  'showtimes/fetchShowtimes',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      // API trả về { data: [...] } hoặc [...] tùy cấu hình, xử lý an toàn:
      return response.data.data || response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi tải lịch chiếu');
    }
  }
);

interface ShowtimeState {
  list: Showtime[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ShowtimeState = {
  list: [],
  isLoading: false,
  error: null,
};

const showtimeSlice = createSlice({
  name: 'showtimes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShowtimes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShowtimes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchShowtimes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default showtimeSlice.reducer;