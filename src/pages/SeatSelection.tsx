import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

// Import Actions
import { fetchMovies } from "../redux/slices/movieSlice";
import { setBookingInfo, fetchBookedSeats } from "../redux/slices/bookingSlice";
import { fetchShowtimes, Showtime } from "../redux/slices/showtimeSlice"; // Import slice showtime

export default function BookingPage() {
  const { id } = useParams<{ id: string }>(); // Movie ID
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // --- 1. LẤY DỮ LIỆU TỪ REDUX ---
  const { list: movies, isLoading: isMovieLoading } = useAppSelector((state) => state.movies);
  const { list: allShowtimes, isLoading: isShowtimeLoading } = useAppSelector((state) => state.showtimes);
  const { bookedSeats } = useAppSelector((state) => state.booking);

  const movie = useMemo(() => movies.find((m) => m._id === id), [movies, id]);

  // --- 2. LOCAL STATE ---
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  // State quản lý lịch chiếu
  const [selectedDateKey, setSelectedDateKey] = useState<string>(""); // Lưu ngày đang chọn (VD: "08/12/2025")
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>(""); // Lưu ID suất chiếu cụ thể

  // Cấu hình ghế
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 14;
  const vipRows = ["F", "G", "H"]; 

  // --- 3. LOGIC GOM NHÓM LỊCH CHIẾU (QUAN TRỌNG) ---
  // API trả về list rời rạc -> Gom lại thành object: { "08/12/2025": [Showtime1, Showtime2], ... }
  const groupedShowtimes = useMemo(() => {
    if (!allShowtimes || !id) return {};

    // B1: Lọc suất chiếu của phim hiện tại
    const movieShowtimes = allShowtimes.filter((st) => st.movie_id === id);

    // B2: Gom nhóm theo ngày
    const groups: Record<string, Showtime[]> = {};
    
    movieShowtimes.forEach((st) => {
        const dateObj = new Date(st.start_time);
        // Tạo key ngày chuẩn DD/MM/YYYY để hiển thị và so sánh
        const dateKey = dateObj.toLocaleDateString('en-GB'); 
        
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(st);
    });

    // B3: Sắp xếp giờ chiếu trong từng ngày (Tăng dần)
    Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    });

    return groups;
  }, [allShowtimes, id]);

  // Lấy danh sách các ngày có lịch chiếu (để render Tab Ngày)
  const availableDates = useMemo(() => Object.keys(groupedShowtimes), [groupedShowtimes]);

  // Lấy danh sách suất chiếu của ngày đang được chọn (để render Nút Giờ)
  const currentShowtimes = useMemo(() => {
      return selectedDateKey ? groupedShowtimes[selectedDateKey] || [] : [];
  }, [groupedShowtimes, selectedDateKey]);

  // Lấy thông tin chi tiết của suất chiếu đang chọn
  const activeShowtime = useMemo(() => {
      return currentShowtimes.find(st => st._id === selectedShowtimeId);
  }, [currentShowtimes, selectedShowtimeId]);


  // --- 4. TÍNH TỔNG TIỀN ---
  const totalAmount = useMemo(() => {
    if (!activeShowtime) return 0;
    
    // Giá cơ bản lấy từ API (Nếu không có thì fallback 60k)
    const basePrice = activeShowtime.base_price || 60000; 
    const vipSurcharge = 20000; // Phụ thu ghế VIP

    return selectedSeats.reduce((total, seat) => {
      const row = seat.charAt(0);
      const isVip = vipRows.includes(row);
      const seatPrice = isVip ? (basePrice + vipSurcharge) : basePrice;
      return total + seatPrice;
    }, 0);
  }, [selectedSeats, activeShowtime]);


  // --- 5. EFFECTS (GỌI API) ---
  
  // Load Phim và Lịch chiếu khi vào trang
  useEffect(() => {
    if (movies.length === 0) dispatch(fetchMovies());
    dispatch(fetchShowtimes()); // 🔥 Gọi API lấy toàn bộ lịch chiếu
  }, [dispatch, movies.length]);

  // Tự động chọn Ngày đầu tiên khi có dữ liệu
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDateKey) {
        setSelectedDateKey(availableDates[0]);
    }
  }, [availableDates]);

  // Tự động chọn Giờ đầu tiên khi đổi Ngày
  useEffect(() => {
    if (currentShowtimes.length > 0) {
        setSelectedShowtimeId(currentShowtimes[0]._id);
    } else {
        setSelectedShowtimeId("");
    }
  }, [selectedDateKey, currentShowtimes]);

  // 🔥 Fetch Ghế đã đặt khi ID suất chiếu thay đổi
  useEffect(() => {
    if (selectedShowtimeId) {
        setSelectedSeats([]); // Reset ghế đang chọn của user
        // Gọi API check ghế dựa trên ID suất chiếu (Chính xác 100%)
        dispatch(fetchBookedSeats({ showtimeId: selectedShowtimeId }));
    }
  }, [dispatch, selectedShowtimeId]);


  // --- 6. HANDLERS ---
  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleProceedPayment = () => {
    if (!movie || !activeShowtime) return;

    // Dispatch thông tin sang trang thanh toán
    dispatch(setBookingInfo({
        movie: movie,
        date: selectedDateKey,
        time: new Date(activeShowtime.start_time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
        seats: selectedSeats,
        totalAmount: totalAmount,
        showtimeId: activeShowtime._id, // 🔥 QUAN TRỌNG: Gửi ID này để lưu vào DB booking
        pricePerSeat: activeShowtime.base_price
    }));

    navigate("/payment");
  };

  // --- RENDER ---
  if (isMovieLoading || isShowtimeLoading) return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-white">Đang tải dữ liệu...</div>;
  if (!movie) return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-red-500">Không tìm thấy phim!</div>;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-200 font-sans pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header Phim */}
        <div className="flex flex-col md:flex-row gap-8 mb-10 bg-[#151a23] p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="w-full md:w-1/4 max-w-[200px] shrink-0 mx-auto md:mx-0">
            <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover rounded-lg shadow-2xl"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x450?text=No+Image"; }}
            />
          </div>
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white uppercase">{movie.title}</h1>
            <div className="text-sm text-gray-400">
              <p>Thể loại: {movie.genres?.join(", ")}</p>
              <p>Thời lượng: {movie.duration_min} phút</p>
            </div>
          </div>
        </div>

        {/* --- KHU VỰC CHỌN LỊCH CHIẾU (DYNAMIC) --- */}
        <div className="mb-12">
            
            {/* Danh sách Ngày */}
            <div className="flex flex-wrap gap-2 mb-4">
                {availableDates.length > 0 ? availableDates.map((dateStr) => {
                    const [day, month, year] = dateStr.split('/');
                    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
                    const dow = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' });

                    return (
                        <button
                            key={dateStr}
                            onClick={() => setSelectedDateKey(dateStr)}
                            className={`flex flex-col items-center justify-center w-20 h-20 rounded-lg border-2 transition-all ${
                                selectedDateKey === dateStr 
                                ? "bg-red-600 border-red-600 text-white scale-105 shadow-lg" 
                                : "bg-[#151a23] border-gray-800 text-gray-400 hover:border-gray-600"
                            }`}
                        >
                            <span className="text-2xl font-bold">{day}/{month}</span>
                            <span className="text-[10px] uppercase font-bold">{dow}</span>
                        </button>
                    );
                }) : (
                    <p className="text-gray-500 italic">Chưa có lịch chiếu cho phim này.</p>
                )}
            </div>

            {/* Danh sách Giờ */}
            {selectedDateKey && currentShowtimes.length > 0 && (
                <div className="bg-[#151a23] p-4 rounded-xl border border-gray-800">
                    <p className="text-sm text-gray-500 mb-3 uppercase font-bold">Giờ chiếu</p>
                    <div className="flex flex-wrap gap-3">
                        {currentShowtimes.map((st) => {
                            const timeStr = new Date(st.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                            return (
                                <button
                                    key={st._id}
                                    onClick={() => setSelectedShowtimeId(st._id)}
                                    className={`px-6 py-2 rounded-lg font-bold border transition-all ${
                                        selectedShowtimeId === st._id
                                        ? "border-red-600 text-red-500 bg-red-600/10"
                                        : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
                                    }`}
                                >
                                    {timeStr}
                                </button>
                            );
                        })}
                    </div>
                    {/* Hiển thị tên phòng chiếu */}
                    <p className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {activeShowtime?.screen_name || "Đang cập nhật phòng"}
                    </p>
                </div>
            )}
        </div>

        {/* --- SƠ ĐỒ GHẾ --- */}
        <div className="animate-fade-in-up">
            {/* Màn hình */}
            <div className="text-center mb-10">
              <div className="relative inline-block">
                <div className="h-2 w-64 md:w-96 bg-gray-600 rounded-full mb-4 mx-auto shadow-[0_0_30px_rgba(255,255,255,0.2)]"></div>
                <p className="text-gray-600 text-xs tracking-[0.3em] uppercase">Màn hình</p>
              </div>
            </div>

            {/* Lưới ghế */}
            <div className="overflow-x-auto pb-8">
              <div className="min-w-[700px] flex flex-col items-center gap-3">
                {rows.map((row) => (
                  <div key={row} className="flex items-center gap-4">
                    <span className="w-6 text-center text-gray-500 font-bold text-sm">{row}</span>
                    <div className="flex gap-1.5 md:gap-2">
                      {[...Array(seatsPerRow)].map((_, i) => {
                        const seat = `${row}${i + 1}`;
                        const isVIP = vipRows.includes(row);
                        const isTaken = bookedSeats.includes(seat);
                        const isSelected = selectedSeats.includes(seat);

                        let seatStyle = "bg-[#2b303b] border-b-2 border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white cursor-pointer";
                        if (isTaken) seatStyle = "bg-red-900/20 border-transparent text-transparent cursor-not-allowed"; 
                        else if (isSelected) seatStyle = "bg-red-600 border-red-800 text-white shadow-lg transform scale-110 z-10"; 
                        else if (isVIP) seatStyle = "bg-[#2b303b] border-yellow-600 text-yellow-500 hover:bg-gray-600 hover:text-white"; 

                        return (
                          <button
                            key={seat}
                            onClick={() => toggleSeat(seat)}
                            disabled={isTaken}
                            className={`w-8 h-8 md:w-9 md:h-9 rounded-t-md text-[10px] md:text-xs font-bold transition-all duration-200 ${seatStyle}`}
                          >
                            {!isTaken ? i + 1 : "X"}
                          </button>
                        );
                      })}
                    </div>
                    <span className="w-6 text-center text-gray-500 font-bold text-sm">{row}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chú thích */}
            <div className="flex justify-center gap-6 text-sm text-gray-400 pt-6 border-t border-gray-800">
               <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#2b303b] border-b-2 border-gray-600"></div> Thường</div>
               <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#2b303b] border-b-2 border-yellow-600"></div> VIP</div>
               <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-600"></div> Đang chọn</div>
               <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-900/20"></div> Đã bán</div>
            </div>
        </div>

      </div>

      {/* --- FOOTER FIXED --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#151a23]/95 backdrop-blur-md border-t border-gray-800 p-4 z-50">
         <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="hidden sm:block">
               <p className="text-gray-400 text-xs">Ghế đang chọn</p>
               <div className="flex flex-wrap gap-2 mt-1">
                  {selectedSeats.length > 0 ? selectedSeats.map(s => (
                      <span key={s} className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">{s}</span>
                  )) : <span className="text-gray-500 italic">Chưa chọn</span>}
               </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <p className="text-gray-400 text-xs">Tổng cộng</p>
                  <p className="text-2xl font-bold text-white">{totalAmount.toLocaleString()} <span className="text-red-600 text-sm">đ</span></p>
               </div>
               <button
                  onClick={handleProceedPayment}
                  disabled={selectedSeats.length === 0}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
               >
                  TIẾP TỤC
               </button>
            </div>
         </div>
      </div>

    </div>
  );
}