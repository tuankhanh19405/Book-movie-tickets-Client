import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { message, Spin } from "antd";
import { clearBooking } from "../redux/slices/bookingSlice";
import axios from "axios";

export default function PaymentQRPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // 1. Lấy dữ liệu vé đang chọn từ Redux
  const { currentBooking } = useAppSelector((state) => state.booking);

  // Timer đếm ngược (7 phút = 420 giây)
  const [timeLeft, setTimeLeft] = useState(420); 
  const [isChecking, setIsChecking] = useState(false);
  
  // 🔥 FIX LỖI: Cờ đánh dấu đã thành công
  // Giúp useEffect không đá về Home khi ta xóa Redux
  const [isSuccess, setIsSuccess] = useState(false); 

  // --- BẢO VỆ ROUTE ---
  useEffect(() => {
    // Chỉ đá về Home nếu: KHÔNG có booking VÀ KHÔNG phải trạng thái thành công
    if (!currentBooking && !isSuccess) {
      message.warning("Phiên giao dịch không tồn tại hoặc đã hết hạn.");
      navigate("/");
    }
  }, [currentBooking, navigate, isSuccess]);

  // --- LOGIC ĐẾM NGƯỢC ---
  useEffect(() => {
    if (timeLeft === 0) {
        message.error("Hết thời gian thanh toán! Vui lòng đặt lại.");
        navigate("/");
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // --- HÀM XỬ LÝ THANH TOÁN ---
  const handlePaidConfirm = async () => {
    if (!currentBooking) return;
    
    setIsChecking(true);

    try {
        // 1. Chuẩn bị Payload (Dữ liệu gửi lên Server)
        const payload = {
            movie_id: currentBooking.movie?._id,
            movie_title: currentBooking.movie?.title,
            seats: currentBooking.seats,
            total_amount: currentBooking.totalAmount,
            
            // Các trường dùng để khóa ghế (Quan trọng)
            date: currentBooking.date,
            time: currentBooking.time,
            
            payment_method: "VietQR",
            status: "confirmed",
            created_at: new Date().toISOString()
        };

        console.log("Đang gửi đơn hàng:", payload);

        // 2. Gọi API Lưu đơn hàng
        const response = await axios.post(
            "https://api-class-o1lo.onrender.com/api/khanhphuong/bookings",
            payload
        );

        // 3. Xử lý thành công
        if (response.status === 200 || response.status === 201) {
            message.success("Thanh toán thành công! Vé đã được lưu.");

            // Lưu tạm thông tin vé để hiển thị ở trang sau
            const savedBooking = currentBooking;

            // ✅ BƯỚC QUAN TRỌNG: Bật cờ thành công lên
            setIsSuccess(true); 

            // Xóa dữ liệu trong Redux (lúc này useEffect sẽ bị chặn bởi isSuccess nên ko đá về Home)
            dispatch(clearBooking()); 

            // Chuyển hướng sang trang Vé
            navigate("/ticket-success", { state: { booking: savedBooking } });
        } else {
            message.error("Lỗi server: Không thể lưu vé.");
        }

    } catch (error: any) {
        console.error("Lỗi API:", error);
        message.error("Có lỗi xảy ra khi kết nối đến Server.");
    } finally {
        setIsChecking(false);
    }
  };

  // --- RENDERING ---
  if (!currentBooking) return null;

  const { movie, seats, totalAmount, date, time } = currentBooking;
  
  // Tạo mã đơn hàng và nội dung chuyển khoản ngẫu nhiên
  // Dùng useMemo hoặc lấy từ biến cố định để tránh render lại bị đổi mã (ở đây demo nên để biến thường cũng được)
  const orderId = "NCC" + Math.floor(Math.random() * 10000);
  const transferContent = `VEPHIM ${orderId}`;
  
  // Link tạo QR VietQR
  const qrUrl = `https://img.vietqr.io/image/MB-0358900683-compact2.png?amount=${totalAmount}&addInfo=${transferContent}&accountName=NCC CINEMA`;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-300 font-sans flex flex-col pt-8 pb-20">
      <div className="flex-1 container mx-auto px-4 xl:px-0 max-w-[1200px]">
        <h1 className="text-2xl font-bold text-white mb-6 uppercase border-l-4 border-red-600 pl-4">Thanh toán qua mã QR</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* --- CỘT TRÁI: THÔNG TIN ĐƠN HÀNG --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Thông tin phim */}
            <div className="bg-[#151a23] rounded-xl border border-gray-800 p-6 shadow-sm">
              <h2 className="text-white font-bold text-lg mb-6 border-b border-gray-800 pb-2">Thông tin vé</h2>
              
              <div className="flex gap-4 mb-6">
                <img 
                    src={movie?.poster_url} 
                    alt="poster" 
                    className="w-24 h-36 object-cover rounded-lg shadow-lg bg-gray-700"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x450?text=No+Image"; }} 
                />
                <div>
                    <p className="text-gray-500 text-sm mb-1">Phim</p>
                    <h3 className="text-white font-bold text-xl uppercase tracking-wide leading-tight mb-2">
                        {movie?.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600">2D Phụ đề</span>
                        <span className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600">{movie?.duration_min} phút</span>
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
                <div>
                    <p className="text-gray-500 mb-1">Thời gian</p>
                    <div className="flex items-center gap-2 text-orange-500 font-bold text-base">
                        <span>{time}</span>
                        <span className="text-gray-600">|</span>
                        <span>{date}</span>
                    </div>
                </div>
                <div>
                    <p className="text-gray-500 mb-1">Ghế ngồi</p>
                    <p className="text-white font-bold text-base break-words">{seats.join(", ")}</p>
                </div>
                <div>
                    <p className="text-gray-500 mb-1">Rạp chiếu</p>
                    <p className="text-white font-bold text-base">NCC Cinema</p>
                </div>
                <div>
                    <p className="text-gray-500 mb-1">Phòng chiếu</p>
                    <p className="text-white font-bold text-base">Cinema 05</p>
                </div>
              </div>
            </div>

            {/* Card 2: Chi tiết tiền */}
            <div className="bg-[#151a23] rounded-xl border border-gray-800 p-6 shadow-sm">
              <h2 className="text-white font-bold text-lg mb-4 border-b border-gray-800 pb-2">Chi tiết thanh toán</h2>
              
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Giá vé (x{seats.length})</span>
                    <span className="text-white font-bold">{(currentBooking.totalAmount / seats.length).toLocaleString()} đ</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Phí dịch vụ</span>
                    <span className="text-white font-bold">0 đ</span>
                 </div>
                 <div className="border-t border-gray-800 pt-3 flex justify-between items-center">
                    <span className="text-white font-bold uppercase">Tổng cộng</span>
                    <span className="text-2xl font-bold text-red-500">{totalAmount.toLocaleString()} đ</span>
                 </div>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: QUÉT MÃ QR --- */}
          <div className="lg:col-span-1">
            <div className="bg-[#151a23] rounded-xl border border-gray-800 p-6 shadow-xl sticky top-4 text-center">
              
              {/* Header QR */}
              <div className="mb-4">
                <p className="text-white font-bold mb-1">Quét mã để thanh toán</p>
                <div className="flex items-center justify-center gap-1 opacity-80">
                  <span className="text-xs text-gray-400">Powered by</span>
                  <span className="text-blue-500 font-black italic tracking-tighter">VietQR</span>
                </div>
              </div>

              {/* Ảnh QR */}
              <div className="bg-white p-2 rounded-lg mb-5 w-64 h-64 mx-auto shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 text-red-500 font-bold text-xl mb-4 animate-pulse bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                <span>⏱</span>
                <span>{formatTime(timeLeft)}</span>
              </div>

              {/* Note */}
              <div className="text-left bg-blue-900/20 p-3 rounded border border-blue-900/50 mb-6">
                <p className="text-blue-400 text-xs font-bold mb-1">NỘI DUNG CHUYỂN KHOẢN:</p>
                <div className="flex justify-between items-center bg-[#0b0e14] p-2 rounded border border-gray-700">
                    <code className="text-white font-mono font-bold">{transferContent}</code>
                    <button className="text-xs text-gray-500 hover:text-white" onClick={() => navigator.clipboard.writeText(transferContent)}>COPY</button>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">Vui lòng nhập chính xác nội dung này để hệ thống tự động ghi nhận vé.</p>
              </div>

              {/* Nút Xác nhận */}
              <button 
                onClick={handlePaidConfirm}
                disabled={isChecking}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-red-900/50 flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                {isChecking && <Spin size="small" />}
                {isChecking ? "Đang xử lý..." : "Xác nhận đã thanh toán"}
              </button>
              
              <button 
                onClick={() => navigate(-1)}
                className="mt-3 text-sm text-gray-500 hover:text-white transition underline"
              >
                Chọn phương thức khác
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}