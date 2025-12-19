import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Home, Download } from "lucide-react";
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

  // --- LOGIC TẢI VÉ ---
  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;
    try {
      message.loading({ content: "Đang tạo ảnh vé...", key: "downloading" });
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: "#0b0e14",
        scale: 2,
        useCORS: true, 
      });
      const link = document.createElement("a");
      link.download = `Ve_Xem_Phim_${booking._id.slice(-6)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      message.success({ content: "Đã tải vé về máy!", key: "downloading" });
    } catch (error) {
      console.error("Lỗi tải vé:", error);
      message.error({ content: "Không thể tải vé.", key: "downloading" });
    }
  };

  if (!booking) return null;

  // --- CHUẨN BỊ DỮ LIỆU ---
  const movieTitle = booking.movie_title || booking.movie?.title || "Phim";
  const showTimeInfo = booking.time && booking.date ? `${booking.time} - ${booking.date}` : "Đang cập nhật";
  const posterUrl = booking.movie_poster || booking.movie?.poster_url;
  const cinemaName = "NCC Cinema";
  const roomName = "Cinema 05";
  
  // ID Vé dùng cho QR Code
  const ticketId = booking._id || "";

  // Lấy danh sách tên ghế và nối lại thành chuỗi (VD: "A5, A6, A7")
  const seatListStr = Array.isArray(booking.seats) 
    ? booking.seats.join(", ") 
    : (booking.tickets ? booking.tickets.map((t:any) => t.seat_name).join(", ") : "");

  return (
    <div className="min-h-screen bg-[#0b0e14] font-sans flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in-down">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <Check size={48} strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Thanh toán thành công</h1>
          <p className="text-gray-400">Vé đã được lưu. Vui lòng đưa mã QR này cho nhân viên soát vé.</p>
        </div>

        {/* --- KHUNG VÉ (1 VÉ DUY NHẤT) --- */}
        <div ref={ticketRef} className="bg-[#151a23] rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative flex flex-col md:flex-row">
          
          {/* TRÁI: THÔNG TIN CHI TIẾT */}
          <div className="p-8 md:w-2/3 border-b md:border-b-0 md:border-r border-dashed border-gray-700 relative">
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0b0e14] rounded-full hidden md:block"></div>
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0b0e14] rounded-full hidden md:block"></div>

            <div className="flex gap-6">
              {/* Poster */}
              <div className="shrink-0 w-32 h-48 rounded-lg overflow-hidden shadow-lg border border-gray-700 hidden sm:block">
                {posterUrl && (
                  <img src={posterUrl} alt={movieTitle} className="w-full h-full object-cover" crossOrigin="anonymous" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div>
                    <h2 className="text-2xl font-bold text-white uppercase leading-tight mb-2">{movieTitle}</h2>
                    <span className="bg-[#ce1212] text-white text-xs font-bold px-2 py-1 rounded">Vé trọn gói</span>
                </div>

                <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div className="col-span-2">
                        <p className="text-gray-500 mb-1">Suất chiếu</p>
                        <p className="text-[#ce1212] font-bold text-lg">{showTimeInfo}</p>
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
                    <p className="text-gray-500 text-sm mb-1">Danh sách ghế:</p>
                    <p className="text-white font-black text-2xl tracking-widest">{seatListStr}</p>
                </div>
              </div>
            </div>
          </div>

          {/* PHẢI: 1 MÃ QR DUY NHẤT */}
          <div className="p-8 md:w-1/3 bg-[#1c222e] flex flex-col items-center justify-center relative border-l border-dashed border-gray-700">
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#0b0e14] rounded-full md:hidden"></div>
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#0b0e14] rounded-full md:hidden"></div>

             <p className="text-gray-400 text-sm font-bold mb-4 tracking-widest">QR CHECK-IN</p>
             
             <div className="bg-white p-3 rounded-lg shadow-lg mb-4">
                {/* QR Code chứa ID Đơn Hàng (Không có tên ghế) */}
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId}`} 
                    alt="Ticket QR"
                    className="w-32 h-32"
                    crossOrigin="anonymous"
                />
             </div>

             <div className="text-center space-y-1">
                <p className="text-gray-500 text-xs">Mã đơn hàng</p>
                <p className="text-white font-mono font-bold text-lg tracking-widest">{ticketId.slice(-8).toUpperCase()}</p>
             </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition shadow-lg w-full sm:w-auto justify-center">
                <Home size={18} /> Về trang chủ
            </button>
            <button onClick={handleDownloadTicket} className="flex items-center gap-2 px-8 py-3 bg-[#1c222e] hover:bg-[#252b3b] text-white border border-gray-700 rounded-full font-bold transition w-full sm:w-auto justify-center group">
                <Download size={18} className="text-gray-400 group-hover:text-white transition" /> Lưu vé về máy
            </button>
        </div>

      </div>
    </div>
  );
}