import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// --- CẤU HÌNH API ---
const API_URL = "https://api-class-o1lo.onrender.com/api/khanhphuong/bookings";

// --- TYPE DEFINITIONS (Định nghĩa kiểu dữ liệu cho chuẩn) ---
export interface TicketItem {
  seat_name: string;
  price: number;
  type?: string;
}

export interface Booking {
  _id?: string;
  user_id: string;
  showtime_id: string;
  movie_id?: string;
  movie_title?: string;
  tickets: TicketItem[]; // Danh sách ghế chi tiết
  seats?: string[];      // Mảng tên ghế (để lọc nhanh)
  total_amount: number;
  payment_info?: any;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at?: string;
}

// =======================================================
// 1. THUNK: TẠO MỚI ĐƠN HÀNG (Create Booking) - 🔥 MỚI THÊM
// =======================================================
export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData: any, thunkAPI) => {
    try {
      // Gọi API POST để lưu vé vào DB
      const response = await axios.post(API_URL, bookingData);
      return response.data.data || response.data;
    } catch (error: any) {
      // Trả về lỗi nếu thất bại
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Đặt vé thất bại');
    }
  }
);

// =======================================================
// 2. THUNK: LẤY LỊCH SỬ VÉ THEO USER ID
// =======================================================
export const fetchBookingsByUserId = createAsyncThunk(
  'booking/fetchBookingsByUserId',
  async (userId: string, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      const allBookings = response.data?.data || [];

      // Logic lọc phía Client (do API chưa hỗ trợ filter query params)
      const userHistory = allBookings.filter((booking: any) => {
        // Ép kiểu String để so sánh chính xác (tránh lỗi number vs string)
        return String(booking.user_id) === String(userId);
      });

      // Sắp xếp: Mới nhất lên đầu
      return userHistory.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || a.date).getTime();
        const dateB = new Date(b.created_at || b.date).getTime();
        return dateB - dateA;
      });

    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi lấy lịch sử vé');
    }
  }
);

// =======================================================
// 3. THUNK: LẤY DANH SÁCH GHẾ ĐÃ ĐẶT (Để hiển thị ghế đỏ)
// =======================================================
export const fetchBookedSeats = createAsyncThunk(
  'booking/fetchBookedSeats',
  async (params: { showtimeId?: string; movieId?: string; date?: string; time?: string }) => {
    try {
      const response = await axios.get(API_URL);
      const allBookings = response.data?.data || [];
      const occupiedSeats: string[] = [];

      allBookings.forEach((booking: any) => {
        let isMatch = false;

        // Ưu tiên 1: Check theo Showtime ID (Chính xác nhất)
        if (params.showtimeId && String(booking.showtime_id) === String(params.showtimeId)) {
          isMatch = true;
        }
        // Ưu tiên 2: Check theo Phim + Ngày + Giờ (Nếu không có Showtime ID)
        else if (params.movieId && String(booking.movie_id) === String(params.movieId)) {
          // Lưu ý: Cần đảm bảo format ngày/giờ khớp nhau
          if (booking.time === params.time) isMatch = true;
        }

        if (isMatch) {
          // Xử lý dữ liệu đa dạng (Hỗ trợ cả cấu trúc cũ và mới)
          if (Array.isArray(booking.tickets)) {
            // Nếu là mảng object [{seat_name: "A1"}, ...]
            occupiedSeats.push(...booking.tickets.map((t: any) => t.seat_name));
          } else if (Array.isArray(booking.seats)) {
            // Nếu là mảng string ["A1", "A2"]
            occupiedSeats.push(...booking.seats);
          }
        }
      });

      // Loại bỏ trùng lặp bằng Set
      return [...new Set(occupiedSeats)];
    } catch (error) {
      console.error("Lỗi lấy ghế:", error);
      return [];
    }
  }
);

// =======================================================
// STATE & SLICE
// =======================================================

interface BookingState {
  currentBooking: any | null; // Dữ liệu vé đang thao tác (chưa thanh toán)
  bookedSeats: string[];      // Danh sách ghế đã bị người khác đặt
  history: Booking[];         // Lịch sử đặt vé của User
  isLoading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: BookingState = {
  currentBooking: null,
  bookedSeats: [],
  history: [],
  isLoading: false,
  error: null,
  status: 'idle',
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // Action để lưu tạm thông tin vé khi user đang chọn ghế/combo
    setBookingInfo: (state, action: PayloadAction<any>) => {
      state.currentBooking = action.payload;
    },
    // Reset thông tin vé sau khi thanh toán xong hoặc hủy
    clearBooking: (state) => {
      state.currentBooking = null;
      state.bookedSeats = [];
      state.error = null;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // --- XỬ LÝ LẤY GHẾ ĐÃ ĐẶT ---
      .addCase(fetchBookedSeats.fulfilled, (state, action) => {
        state.bookedSeats = action.payload;
      })

      // --- XỬ LÝ LẤY LỊCH SỬ ---
      .addCase(fetchBookingsByUserId.pending, (state) => {
        state.isLoading = true;
        state.status = 'loading';
      })
      .addCase(fetchBookingsByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'succeeded';
        state.history = action.payload;
      })
      .addCase(fetchBookingsByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // --- XỬ LÝ TẠO VÉ (CREATE) ---
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.isLoading = false;
        // Có thể clear booking tạm thời ở đây nếu muốn
        // state.currentBooking = null; 
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setBookingInfo, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;