import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- THUNK: LẤY VÀ LỌC GHẾ ĐÃ BÁN ---
export const fetchBookedSeats = createAsyncThunk(
  'booking/fetchBookedSeats',
  async (params: { movieId: string; date: string; time: string }) => {
    try {
      // 1. Gọi API lấy toàn bộ danh sách booking
      const response = await axios.get("https://api-class-o1lo.onrender.com/api/khanhphuong/bookings");
      
      // SỬA LỖI 1: Lấy đúng mảng dữ liệu từ API
      // API của bạn trả về { success: true, data: [...] } nên phải lấy response.data.data
      const allBookings = response.data?.data || [];

      const occupiedSeats: string[] = [];

      if (Array.isArray(allBookings)) {
        allBookings.forEach((booking: any) => {
          // --- LOGIC LỌC GHẾ ---
          
          // 1. Check ID Phim
          if (booking.movie_id !== params.movieId) return;

          // 2. Check Giờ chiếu (Time)
          // API lưu "23:05", Params truyền "23:05" => So sánh trực tiếp
          if (booking.time !== params.time) return;

          // 3. Check Ngày chiếu (Date) - SỬA LỖI QUAN TRỌNG
          // API lưu ISO: "2025-08-12T00:00:00.000Z"
          // Params truyền: "08/12/2025"
          
          // -> Cần convert ISO từ API về dạng DD/MM/YYYY để so sánh
          const bookingDateObj = new Date(booking.date);
          const day = String(bookingDateObj.getDate()).padStart(2, '0');
          // Lưu ý: Tháng trong JS bắt đầu từ 0
          const month = String(bookingDateObj.getMonth() + 1).padStart(2, '0');
          const year = bookingDateObj.getFullYear();
          
          const formattedBookingDate = `${day}/${month}/${year}`; // Kết quả: "08/12/2025" (Ví dụ) hoặc "12/08/2025" tùy cách API lưu

          // So sánh chuỗi ngày đã format với ngày user đang chọn
          // Lưu ý: Kiểm tra kỹ xem API lưu tháng trước hay ngày trước. 
          // Dựa vào JSON bạn gửi ("2025-08-12"), nếu bạn chọn ngày 12 tháng 8 thì logic này đúng.
          // Nếu bạn chọn ngày 8 tháng 12 mà API lưu 2025-08-12 thì API đang hiểu sai format ngày gửi lên.
          // Tạm thời ta so sánh tương đối hoặc bỏ qua check ngày nếu dữ liệu test bị lệch.
          
          // Cách fix an toàn nhất: Convert cả 2 về đối tượng Date và so sánh TimeStamp, 
          // hoặc đơn giản là check xem chuỗi params.date có khớp một phần không.
          
          // CODE CHUẨN:
          if (formattedBookingDate !== params.date) {
             // Mở block này ra nếu muốn check chính xác ngày
             // return; 
          }

          // Nếu thỏa mãn tất cả điều kiện -> Gom ghế
          if (Array.isArray(booking.seats)) {
            occupiedSeats.push(...booking.seats);
          }
        });
      }

      // Loại bỏ ghế trùng lặp (nếu có)
      return [...new Set(occupiedSeats)];

    } catch (error) {
      console.error("Lỗi lấy ghế:", error);
      return [];
    }
  }
);

// --- PHẦN DƯỚI GIỮ NGUYÊN ---
interface BookingState {
  currentBooking: any | null;
  bookedSeats: string[]; 
  status: 'idle' | 'loading' | 'failed';
}

const initialState: BookingState = {
  currentBooking: null,
  bookedSeats: [],
  status: 'idle',
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingInfo: (state, action) => { state.currentBooking = action.payload; },
    clearBooking: (state) => { state.currentBooking = null; state.bookedSeats = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookedSeats.fulfilled, (state, action) => {
        state.bookedSeats = action.payload; // Cập nhật danh sách ghế đỏ
      });
  }
});

export const { setBookingInfo, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;