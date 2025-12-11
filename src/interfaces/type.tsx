// ==========================================
// 1. ENUMS & CONSTANTS (Định nghĩa các giá trị cố định)
// ==========================================

// Quyền hạn người dùng
export type UserRole = 'customer' | 'staff' | 'admin';

// Trạng thái phim (Cập nhật theo API thực tế)
// API trả về "released", nhưng UI có thể cần "now_showing", "coming_soon"
export type MovieStatus = 'released' | 'now_showing' | 'coming_soon' | 'ended';

// Trạng thái đơn hàng
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'failed';

// Loại ghế
export type SeatType = 'standard' | 'vip' | 'couple';

// ==========================================
// 2. SUB-INTERFACES (Các object con lồng nhau)
// ==========================================

// Thống kê đánh giá (Khớp với API: rating_stats)
export interface RatingStats {
  average: number; // Ví dụ: 8.1
  count: number;   // Ví dụ: 85000
}

// Cấu trúc ghế hiển thị trên màn hình chọn ghế
export interface SeatLayoutItem {
  id: string;         // "A1"
  row: string;        // "A"
  number: number;     // 1
  type: SeatType;     // "vip"
  price: number;      // Giá vé của ghế này
  is_booked: boolean; // Trạng thái đã bán chưa
  is_selected?: boolean; // Trạng thái người dùng đang chọn (Frontend state)
}

// Phương thức thanh toán lưu trong User
export interface SavedPaymentMethod {
  type: string;       // "Visa", "Momo"
  last4: string;      // "4242"
  token: string;      
}

// Vé chi tiết trong đơn hàng (Snapshot giá tại thời điểm mua)
export interface TicketItem {
  seat_code: string;  // "A1"
  type: SeatType;     // "standard"
  price: number;      // 100000
}

// ==========================================
// 3. MAIN ENTITIES (Các bảng dữ liệu chính)
// ==========================================

// --- 3.1. MOVIE (PHIM) ---
// Khớp 100% với response từ API của bạn
export interface Movie {
  _id: string;
  title: string;
  slug: string;           // "anora"
  description: string;
  duration_min: number;   // 139
  release_date: string;   // ISO String: "2024-10-18T00:00:00.000Z"
  genres: string[];       // ["Comedy", "Drama"]
  director: string;
  cast: string[];         // ["Mikey Madison", ...]
  poster_url: string;
  banner_url?: string;    // Có thể có hoặc không
  status: MovieStatus;    // "released"
  rating_stats: RatingStats;
  createdAt?: string;
  updatedAt?: string;
}

// --- 3.2. USER (NGƯỜI DÙNG) ---
export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string; // Ẩn ở frontend nếu không cần
  phone?: string;
  roles: UserRole[];
  saved_payment_methods?: SavedPaymentMethod[];
  avatar_url?: string;
  created_at?: string;
}

// --- 3.3. SHOWTIME (LỊCH CHIẾU) ---
export interface Showtime {
  _id: string;
  start_time: string; // "2024-12-12T19:30:00Z"
  end_time: string;
  
  screen_name: string; // "Phòng 1"
  movie_id: string;    // Tham chiếu đến Movie
  
  // Snapshot thông tin phim để hiển thị nhanh
  movie_title: string;
  movie_poster: string;
  
  // Quản lý ghế đã đặt
  seats_booked: string[]; // ["A1", "A2"]
  
  base_price: number; // Giá cơ bản
}

// --- 3.4. BOOKING (ĐƠN VÉ) ---
export interface Booking {
  _id: string;
  user_id: string;
  showtime_id: string;
  booking_date: string;
  
  total_amount: number;
  status: BookingStatus;
  
  tickets: TicketItem[]; // Danh sách vé đã mua
  
  payment_method: string; // "Momo", "ZaloPay"
  qr_code_url?: string;
}

// ==========================================
// 4. API RESPONSE INTERFACES (Cấu trúc trả về từ Server)
// ==========================================

// Dùng cho Axios khi gọi danh sách phim
export interface MovieListResponse {
  success: boolean;
  message: string;
  data: Movie[]; // Mảng phim nằm trong này
}

// Dùng cho Axios khi gọi chi tiết 1 phim
export interface MovieDetailResponse {
  success: boolean;
  message: string;
  data: Movie; // Chỉ trả về 1 object phim
}

// Dùng cho response đăng nhập/đăng ký
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}