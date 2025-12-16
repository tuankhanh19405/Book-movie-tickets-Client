import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Home, Download, Share2 } from "lucide-react";
import { message } from "antd";

export default function TicketSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy dữ liệu vé được truyền từ trang PaymentQRPage
  const booking = location.state?.booking;

  // Bảo vệ route: Nếu không có dữ liệu vé (do copy link vào thẳng) -> Về Home
  useEffect(() => {
    if (!booking) {
      message.error("Không tìm thấy thông tin vé!");
      navigate("/");
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const { movie, seats, date, time } = booking;
  const cinemaName = "NCC Cinema";
  const roomName = "Cinema 05";
  const orderId = "9724" + Math.floor(Math.random() * 1000); // Giả lập mã đơn hàng

  return (
    <div className="min-h-screen bg-[#0b0e14] font-sans flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* 1. Header thông báo thành công */}
        <div className="text-center space-y-2 animate-fade-in-down">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <Check size={48} strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Thanh toán thành công</h1>
          <p className="text-gray-400">Vé đã được gửi đến email và số điện thoại của bạn.</p>
        </div>

        {/* 2. Chiếc vé điện tử (Ticket Card) */}
        <div className="bg-[#151a23] rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative flex flex-col md:flex-row">
          
          {/* --- TRÁI: POSTER & CHI TIẾT --- */}
          <div className="p-8 md:w-2/3 border-b md:border-b-0 md:border-r border-dashed border-gray-700 relative">
            {/* "Vết cắt" bán nguyệt giả lập vé */}
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0b0e14] rounded-full hidden md:block"></div>
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0b0e14] rounded-full hidden md:block"></div>

            <div className="flex gap-6">
              {/* Poster */}
              <div className="shrink-0 w-32 h-48 rounded-lg overflow-hidden shadow-lg border border-gray-700 hidden sm:block">
                <img 
                  src={movie?.poster_url} 
                  alt={movie?.title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div>
                    <h2 className="text-2xl font-bold text-white uppercase leading-tight mb-2">{movie?.title}</h2>
                    <span className="bg-[#ce1212] text-white text-xs font-bold px-2 py-1 rounded">2D Phụ đề</span>
                    <span className="ml-2 bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded">T16</span>
                </div>

                <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                        <p className="text-gray-500 mb-1">Ngày chiếu</p>
                        <p className="text-white font-bold text-lg">{date}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1">Giờ chiếu</p>
                        <p className="text-[#ce1212] font-bold text-lg">{time}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1">Rạp chiếu</p>
                        <p className="text-white font-bold">{cinemaName}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1">Phòng chiếu</p>
                        <p className="text-white font-bold">{roomName}</p>
                    </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700/50">
                    <p className="text-gray-500 text-sm mb-1">Ghế ngồi</p>
                    <p className="text-white font-bold text-2xl tracking-widest">{seats.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- PHẢI: MÃ QR CHECK-IN --- */}
          <div className="p-8 md:w-1/3 bg-[#1c222e] flex flex-col items-center justify-center relative border-l border-dashed border-gray-700">
             {/* "Vết cắt" bán nguyệt cho mobile */}
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#0b0e14] rounded-full md:hidden"></div>
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#0b0e14] rounded-full md:hidden"></div>

             <p className="text-gray-400 text-sm font-bold mb-4 tracking-widest">MÃ VÉ / QR</p>
             
             <div className="bg-white p-3 rounded-lg shadow-lg mb-4">
                <img 
                    // API tạo QR Code check-in (chứa Mã đơn hàng + Ghế)
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TICKET-${orderId}-${seats.join('')}`} 
                    alt="Ticket QR"
                    className="w-32 h-32"
                />
             </div>

             <div className="text-center space-y-1">
                <p className="text-gray-500 text-xs">Mã đặt chỗ</p>
                <p className="text-white font-mono font-bold text-xl tracking-widest">{orderId}</p>
             </div>
          </div>
        </div>

        {/* 3. Footer Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition shadow-lg shadow-red-900/40 w-full sm:w-auto justify-center"
            >
                <Home size={18} />
                Về trang chủ
            </button>
            
            <button className="flex items-center gap-2 px-8 py-3 bg-[#1c222e] hover:bg-[#252b3b] text-white border border-gray-700 rounded-full font-bold transition w-full sm:w-auto justify-center group">
                <Download size={18} className="text-gray-400 group-hover:text-white transition" />
                Lưu vé về máy
            </button>

            <button className="flex items-center gap-2 px-8 py-3 bg-[#1c222e] hover:bg-[#252b3b] text-white border border-gray-700 rounded-full font-bold transition w-full sm:w-auto justify-center group">
                <Share2 size={18} className="text-gray-400 group-hover:text-white transition" />
                Chia sẻ
            </button>
        </div>

      </div>
    </div>
  );
}