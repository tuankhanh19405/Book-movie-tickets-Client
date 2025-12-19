import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, message, Input, Button, ConfigProvider } from "antd";
import { CreditCard, Lock, ShieldCheck, Calendar, MapPin, Armchair } from "lucide-react";

// --- IMPORT REDUX ---
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createBooking } from "../redux/slices/bookingSlice";

const FakePaymentGateway = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // 1. Lấy User từ Redux
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("atm");

  // Lấy dữ liệu từ trang BookingPage
  const bookingData = location.state || {};
  
  const totalAmount = bookingData.totalAmount || 0; 
  const movieTitle = bookingData.movie?.title || "Phim chưa xác định";
  const seats = bookingData.seats || [];
  const cinemaName = "NCC Cinema - Rạp 5"; 
  const showTime = `${bookingData.time} - ${bookingData.date}`;

  // Bảo vệ route
  useEffect(() => {
    if (!location.state || seats.length === 0) {
      message.warning("Không tìm thấy thông tin đơn hàng hoặc chưa chọn ghế!");
      navigate("/");
    }
  }, [location.state, navigate, seats.length]);

  const handleConfirmPayment = async () => {
    // 1. Kiểm tra đăng nhập
    if (!user || !user._id) {
        message.error("Vui lòng đăng nhập để thực hiện đặt vé!");
        return;
    }

    setLoading(true);

    // 2. CHUẨN BỊ DỮ LIỆU (PAYLOAD) - CẬP NHẬT LOGIC LƯU QR TẠI ĐÂY
    const finalOrderData = {
        user_id: user._id,           
        showtime_id: bookingData.showtimeId, 
        
        // 🔥 UPDATE: Lưu chi tiết từng ghế để sau này tạo QR riêng cho mỗi ghế
        tickets: seats.map((seat: string) => ({
            seat_name: seat,
            price: bookingData.pricePerSeat || (totalAmount / seats.length) || 0,
            type: "standard",
            // Hai trường này giúp Admin quét QR từng ghế riêng biệt
            isCheckIn: false, 
            checkInAt: null
        })),

        // Thông tin thanh toán
        payment_info: {
            method: paymentMethod,
            transaction_id: `TXN-${Date.now()}`,
            provider: paymentMethod === 'atm' ? 'Local Bank' : 'Visa/Master'
        },

        total_amount: totalAmount,
        status: 'confirmed',
        
        // Các trường phụ trợ cho UI
        movie_title: movieTitle, 
        seats: seats,
        
        // Trạng thái chung (tuỳ chọn)
        isCheckIn: false,
    };

    console.log("Payload gửi đi:", finalOrderData);

    try {
        // 3. GỌI REDUX ACTION
        const result = await dispatch(createBooking(finalOrderData)).unwrap();
        
        setLoading(false);
        message.success("Thanh toán thành công!");

        // 4. CHUYỂN TRANG
        // Truyền ID thật từ Database (_id) sang trang Success để tạo QR
        navigate("/ticket-success", { 
            state: { 
              booking: { ...finalOrderData, _id: result._id } 
            } 
        });

    } catch (error: any) {
        setLoading(false);
        console.error("Lỗi đặt vé:", error);
        message.error(typeof error === 'string' ? error : "Lỗi hệ thống, vui lòng thử lại!");
    }
  };

  const inputStyle = "!bg-[#0b0e14] !border-gray-700 !text-white hover:!border-red-600 focus:!border-red-600 h-12 rounded-lg placeholder-gray-500 font-medium";

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ce1212',
          colorBgContainer: '#0b0e14',
          colorText: '#ffffff',
          colorBorder: '#374151',
        },
      }}
    >
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center py-10 px-4 font-sans relative">
        
        {loading && (
          <div className="absolute inset-0 bg-black/90 z-[999] flex flex-col items-center justify-center backdrop-blur-sm rounded-none md:rounded-2xl">
            <Spin size="large" />
            <p className="mt-6 text-white font-bold text-lg animate-pulse">Đang xử lý giao dịch...</p>
          </div>
        )}

        <div className="max-w-5xl w-full bg-[#151a23] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col md:flex-row">
          
          {/* CỘT TRÁI */}
          <div className="w-full md:w-1/3 bg-[#0f1219] p-8 flex flex-col justify-between border-r border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-2 mb-8 text-green-400 bg-green-900/20 px-3 py-1.5 rounded-full w-fit border border-green-900/30">
                <ShieldCheck size={16} />
                <span className="font-bold text-xs uppercase tracking-wider">Thanh toán an toàn</span>
              </div>
              <h2 className="text-gray-500 text-xs font-bold uppercase mb-2 tracking-widest">Đơn hàng</h2>
              <p className="text-2xl font-bold text-white mb-6 uppercase leading-tight line-clamp-2">{movieTitle}</p>
              
              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <Armchair size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">Ghế</p>
                    <p className="text-white font-bold text-lg tracking-widest">{seats.join(", ")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">Rạp</p>
                    <p className="text-white font-medium">{cinemaName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">Thời gian</p>
                    <p className="text-white font-medium">{showTime}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 border-t border-gray-800 pt-6">
              <p className="text-gray-400 text-sm mb-1 font-medium">Tổng thanh toán</p>
              <p className="text-4xl font-bold text-[#ce1212] tracking-tight">
                {totalAmount.toLocaleString()} <span className="text-lg align-top text-gray-500">đ</span>
              </p>
            </div>
          </div>

          {/* CỘT PHẢI: FORM THANH TOÁN */}
          <div className="w-full md:w-2/3 p-8 md:p-10 relative">
            <h3 className="text-2xl font-bold text-white mb-8">Phương thức thanh toán</h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div 
                onClick={() => setPaymentMethod("atm")}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 group
                  ${paymentMethod === "atm" 
                    ? "bg-[#1c222e] border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]" 
                    : "bg-[#0b0e14] border-gray-700 hover:border-gray-500"}
                `}
              >
                <div className={`font-bold text-sm ${paymentMethod === "atm" ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                    Thẻ nội địa (ATM)
                </div>
                <div className="flex gap-1 opacity-60">
                   <div className="w-8 h-5 bg-gray-600 rounded"></div>
                   <div className="w-8 h-5 bg-gray-600 rounded"></div>
                </div>
              </div>

              <div 
                onClick={() => setPaymentMethod("visa")}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 group
                  ${paymentMethod === "visa" 
                    ? "bg-[#1c222e] border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                    : "bg-[#0b0e14] border-gray-700 hover:border-gray-500"}
                `}
              >
                <div className={`font-bold text-sm ${paymentMethod === "visa" ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                    Thẻ quốc tế
                </div>
                <div className="flex gap-1 opacity-80">
                   <div className="w-8 h-5 bg-blue-600 rounded"></div>
                   <div className="w-8 h-5 bg-orange-500 rounded"></div>
                </div>
              </div>
            </div>

            {/* Các ô input giả lập */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Số thẻ</label>
                <Input prefix={<CreditCard size={18} className="text-gray-500 mr-2" />} placeholder="0000 0000 0000 0000" className={inputStyle} maxLength={19} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Tên chủ thẻ</label>
                  <Input placeholder="NGUYEN VAN A" className={`${inputStyle} uppercase`} />
                </div>
                <div className="w-1/3">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Hết hạn</label>
                  <Input placeholder="MM/YY" className={inputStyle} maxLength={5} />
                </div>
              </div>
              {paymentMethod === "visa" && (
                <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Mã CVV</label>
                   <Input prefix={<Lock size={16} className="text-gray-500 mr-2"/>} placeholder="123" className={`${inputStyle} w-1/3`} maxLength={3} type="password"/>
                </div>
              )}
            </div>

            <div className="mt-10">
              <Button 
                  onClick={handleConfirmPayment}
                  disabled={loading}
                  className="w-full h-14 bg-[#ce1212] hover:!bg-red-700 border-none text-white text-lg font-bold rounded-xl shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                  <Lock size={20} /> THANH TOÁN NGAY
              </Button>
              <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
                 <span className="text-xs text-gray-500 text-center">
                    Thông tin được mã hóa 256-bit SSL. <br/> Không lưu thông tin thẻ của bạn.
                 </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default FakePaymentGateway;