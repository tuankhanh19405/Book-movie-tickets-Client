import { useEffect, useRef, useMemo } from "react"; // Thêm useMemo
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Home, Download, Share2 } from "lucide-react";
import { message } from "antd";
import html2canvas from "html2canvas";

export default function TicketSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLDivElement>(null);
  
  const booking = location.state?.booking;

  useEffect(() => {
    if (!booking) {
      message.error("Không tìm thấy thông tin vé!");
      navigate("/");
    }
  }, [booking, navigate]);

  // --- LOGIC TẠO MÃ ĐƠN HÀNG CỐ ĐỊNH (FIX) ---
  const orderId = useMemo(() => {
    if (!booking) return "";
    
    // ƯU TIÊN 1: Nếu có _id thật từ Backend (MongoDB) thì dùng luôn
    if (booking._id) {
        // Lấy 8 ký tự cuối của ID cho ngắn gọn, viết hoa
        return booking._id.slice(-8).toUpperCase(); 
    }

    // ƯU TIÊN 2 (Fallback): Nếu chưa có _id, tự tạo mã dựa trên thông tin vé.
    // Logic: "TênPhim(viết tắt)-SốGhế-GhếĐầuTiên" -> Đảm bảo reload vẫn y nguyên.
    // Ví dụ phim ID 1234, đặt 2 ghế A1, A2 -> Mã: "1234-2A1"
    const movieIdPart = booking.movie?._id ? booking.movie._id.slice(-4) : "VE";
    const seatPart = booking.seats && booking.seats.length > 0 ? `${booking.seats.length}${booking.seats[0]}` : "XX";
    
    return `${movieIdPart}-${seatPart}`.toUpperCase();

  }, [booking]); 
  // useMemo giúp tính toán lại chỉ khi booking thay đổi. 
  // Quan trọng: Vì booking lấy từ location.state (được browser lưu lại khi reload), nên orderId sẽ KHÔNG ĐỔI.

  if (!booking) return null;

  const { movie, seats, date, time } = booking;
  const cinemaName = "NCC Cinema";
  const roomName = "Cinema 05";

  // --- LOGIC TẢI VÉ ---
  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;
    try {
      message.loading({ content: "Đang tạo ảnh vé...", key: "downloading" });
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: "#151a23",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `Ticket_${orderId}.png`; // Tên file cũng cố định theo ID
      link.href = canvas.toDataURL("image/png");
      link.click();
      message.success({ content: "Đã tải vé về máy!", key: "downloading" });
    } catch (error) {
      console.error("Lỗi tải vé:", error);
      message.error({ content: "Không thể tải vé.", key: "downloading" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] font-sans flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in-down">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <Check size={48} strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Thanh toán thành công</h1>
          <p className="text-gray-400">Vé đã được gửi đến email và số điện thoại của bạn.</p>
        </div>

        {/* --- CHIẾC VÉ --- */}
        <div ref={ticketRef} className="bg-[#151a23] rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative flex flex-col md:flex-row">
          
          {/* TRÁI */}
          <div className="p-8 md:w-2/3 border-b md:border-b-0 md:border-r border-dashed border-gray-700 relative">
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0b0e14] rounded-full hidden md:block"></div>
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0b0e14] rounded-full hidden md:block"></div>

            <div className="flex gap-6">
              <div className="shrink-0 w-32 h-48 rounded-lg overflow-hidden shadow-lg border border-gray-700 hidden sm:block">
                <img 
                  src={movie?.poster_url} 
                  alt={movie?.title} 
                  className="w-full h-full object-cover" 
                  crossOrigin="anonymous" 
                />
              </div>

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

          {/* PHẢI - QR CODE CỐ ĐỊNH */}
          <div className="p-8 md:w-1/3 bg-[#1c222e] flex flex-col items-center justify-center relative border-l border-dashed border-gray-700">
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#0b0e14] rounded-full md:hidden"></div>
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#0b0e14] rounded-full md:hidden"></div>

             <p className="text-gray-400 text-sm font-bold mb-4 tracking-widest">MÃ VÉ / QR</p>
             
             <div className="bg-white p-3 rounded-lg shadow-lg mb-4">
                <img 
                    // orderId ở đây bây giờ là cố định, nên QR cũng sẽ cố định
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TICKET-${orderId}`} 
                    alt="Ticket QR"
                    className="w-32 h-32"
                    crossOrigin="anonymous"
                />
             </div>

             <div className="text-center space-y-1">
                <p className="text-gray-500 text-xs">Mã đặt chỗ</p>
                <p className="text-white font-mono font-bold text-xl tracking-widest">{orderId}</p>
             </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition shadow-lg shadow-red-900/40 w-full sm:w-auto justify-center"
            >
                <Home size={18} />
                Về trang chủ
            </button>
            
            <button 
                onClick={handleDownloadTicket} 
                className="flex items-center gap-2 px-8 py-3 bg-[#1c222e] hover:bg-[#252b3b] text-white border border-gray-700 rounded-full font-bold transition w-full sm:w-auto justify-center group"
            >
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