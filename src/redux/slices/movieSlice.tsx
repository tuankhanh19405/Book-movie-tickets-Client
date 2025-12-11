import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Movie, MovieListResponse } from '../../interfaces/type';

// --- 1. THUNK: Gọi API ---
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, thunkAPI) => {
    try {
      // Gọi API với Generic Type để Axios hiểu cấu trúc trả về
      const response = await axios.get<MovieListResponse>('https://api-class-o1lo.onrender.com/api/khanhphuong/films');
      
      // Quan trọng: API trả về { data: [...] }, Axios bọc thêm 1 lớp data nữa
      // => response.data.data mới là mảng phim
      return response.data.data; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Lỗi kết nối API');
    }
  }
);

// --- 2. STATE ---
interface MovieState {
  list: Movie[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  list: [],
  isLoading: false,
  error: null,
};

// --- 3. SLICE ---
const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    // Nếu bạn muốn chức năng filter phim theo status (đang chiếu/sắp chiếu) thì viết ở đây
  },
  extraReducers: (builder) => {
    builder
      // Đang tải
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Thành công
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      // Thất bại
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default movieSlice.reducer;