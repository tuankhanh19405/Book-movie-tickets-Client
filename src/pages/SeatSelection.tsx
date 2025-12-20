import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { message } from "antd";

// Import Actions
import { fetchMovies } from "../redux/slices/movieSlice";
import { setBookingInfo, fetchBookedSeats } from "../redux/slices/bookingSlice";
import { fetchShowtimes } from "../redux/slices/showtimeSlice"; 
import type { Showtime } from "../interfaces/type";

export default function BookingPage() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // --- 1. LẤY DỮ LIỆU TỪ REDUX ---
  const { list: movies, isLoading: isMovieLoading } = useAppSelector((state) => state.movies);
  const { list: allShowtimes, isLoading: isShowtimeLoading } = useAppSelector((state) => state.showtimes);
  const { bookedSeats } = useAppSelector((state) => state.booking);

  const movie = useMemo(() => movies.find((m) => m._id === id), [movies, id]);

  // --- 2. LOCAL STATE ---
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedDateKey, setSelectedDateKey] = useState<string>(""); 
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>(""); 

  // Cấu hình ghế
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 14;
  const vipRows = ["F", "G", "H"]; 

  // --- 3. LOGIC GOM NHÓM LỊCH CHIẾU ---
  const groupedShowtimes = useMemo(() => {
    if (!allShowtimes || !id) return {};
    const movieShowtimes = allShowtimes.filter((st) => st.movie_id === id);
    const groups: Record<string, Showtime[]> = {};
    
    movieShowtimes.forEach((st) => {
        const dateObj = new Date(st.start_time);
        const dateKey = dateObj.toLocaleDateString('en-GB'); // DD/MM/YYYY
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(st);
    });

    Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    });
    return groups;
  }, [allShowtimes, id]);

  const availableDates = useMemo(() => Object.keys(groupedShowtimes), [groupedShowtimes]);
  const currentShowtimes = useMemo(() => selectedDateKey ? groupedShowtimes[selectedDateKey] || [] : [], [groupedShowtimes, selectedDateKey]);
  const activeShowtime = useMemo(() => currentShowtimes.find(st => st._id === selectedShowtimeId), [currentShowtimes, selectedShowtimeId]);

  // --- 4. TÍNH TỔNG TIỀN ---
  const totalAmount = useMemo(() => {
    if (!activeShowtime) return 0;
    const basePrice = activeShowtime.base_price || 60000; 
    const vipSurcharge = 20000; 
    return selectedSeats.reduce((total, seat) => {
      const row = seat.charAt(0);
      const isVip = vipRows.includes(row);
      return total + (isVip ? (basePrice + vipSurcharge) : basePrice);
    }, 0);
  }, [selectedSeats, activeShowtime]);

  // --- 5. EFFECTS ---
  useEffect(() => {
    if (movies.length === 0) dispatch(fetchMovies());
    dispatch(fetchShowtimes()); 
  }, [dispatch, movies.length]);

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDateKey) setSelectedDateKey(availableDates[0]);
  }, [availableDates]);

  useEffect(() => {
    if (currentShowtimes.length > 0) setSelectedShowtimeId(currentShowtimes[0]._id);
    else setSelectedShowtimeId("");
  }, [selectedDateKey, currentShowtimes]);

  useEffect(() => {
    if (selectedShowtimeId) {
        setSelectedSeats([]); 
        dispatch(fetchBookedSeats({ showtimeId: selectedShowtimeId }));
    }
  }, [dispatch, selectedShowtimeId]);

  // --- 6. LOGIC CHECK GHẾ TRỐNG (NÂNG CẤP) ---
  const validateSeatSelection = () => {
    // Tập hợp tất cả các ghế "có người" (ghế đã bán + ghế khách đang chọn)
    const allOccupied = new Set([...bookedSeats, ...selectedSeats]);

    // Duyệt qua từng hàng để kiểm tra tính toàn vẹn của hàng đó
    for (const row of rows) {
        let emptyCount = 0; // Đếm số ghế trống liên tiếp
        let hasProcessedFirstOccupied = false; // Đánh dấu xem đã gặp ghế có người nào trong hàng chưa

        for (let i = 1; i <= seatsPerRow; i++) {
            const seatId = `${row}${i}`;
            const isOccupied = allOccupied.has(seatId);

            if (!isOccupied) {
                // Nếu là ghế trống, tăng biến đếm
                emptyCount++;
            } else {
                // Nếu gặp ghế CÓ NGƯỜI
                
                // 1. Kiểm tra khoảng trống TRƯỚC ghế này
                // Nếu emptyCount == 1, nghĩa là có 1 ghế trống lẻ loi ngay trước ghế này
                if (emptyCount === 1) {
                    return false; // LỖI: Để trống 1 ghế bên trái hoặc đầu hàng
                }

                // Reset biến đếm để tính khoảng trống tiếp theo
                emptyCount = 0;
                hasProcessedFirstOccupied = true;
            }
        }

        // 2. Kiểm tra khoảng trống CUỐI hàng
        // Sau khi chạy hết vòng lặp, nếu emptyCount == 1 và trước đó đã có ghế người ngồi
        // Nghĩa là chừa lại 1 ghế trống ở cuối hàng
        if (hasProcessedFirstOccupied && emptyCount === 1) {
            return false; // LỖI: Để trống 1 ghế cuối hàng
        }
    }
    
    return true; // Hợp lệ
  };

  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleProceedPayment = () => {
    if (!movie || !activeShowtime) return;

    // --- BƯỚC KIỂM TRA QUAN TRỌNG ---
    const isValid = validateSeatSelection();
    if (!isValid) {
        message.error("Vui lòng không để trống 1 ghế đơn lẻ (đầu hàng, cuối hàng hoặc giữa các ghế)!");
        return; 
    }

    dispatch(setBookingInfo({
        movie: movie,
        date: selectedDateKey,
        time: new Date(activeShowtime.start_time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
        seats: selectedSeats,
        totalAmount: totalAmount,
        showtimeId: activeShowtime._id, 
        pricePerSeat: activeShowtime.base_price
    }));

    navigate("/payment");
  };

  // --- RENDER (GIỮ NGUYÊN) ---
  if (isMovieLoading || isShowtimeLoading) return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-white">Đang tải dữ liệu...</div>;
  if (!movie) return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-red-500">Không tìm thấy phim!</div>;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-200 font-sans pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header Phim */}
        <div className="flex flex-col md:flex-row gap-8 mb-10 bg-[#151a23] p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="w-full md:w-1/4 max-w-[200px] shrink-0 mx-auto md:mx-0">
            <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover rounded-lg shadow-2xl" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x450?text=No+Image"; }} />
          </div>
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white uppercase">{movie.title}</h1>
            <div className="text-sm text-gray-400">
              <p>Thể loại: {movie.genres?.join(", ")}</p>
              <p>Thời lượng: {movie.duration_min} phút</p>
            </div>
          </div>
        </div>

        {/* --- KHU VỰC CHỌN LỊCH CHIẾU --- */}
        <div className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
                {availableDates.length > 0 ? availableDates.map((dateStr) => {
                    const [day, month, year] = dateStr.split('/');
                    const dow = new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('vi-VN', { weekday: 'long' });
                    return (
                        <button key={dateStr} onClick={() => setSelectedDateKey(dateStr)} className={`flex flex-col items-center justify-center w-20 h-20 rounded-lg border-2 transition-all ${selectedDateKey === dateStr ? "bg-red-600 border-red-600 text-white scale-105 shadow-lg" : "bg-[#151a23] border-gray-800 text-gray-400 hover:border-gray-600"}`}>
                            <span className="text-2xl font-bold">{day}/{month}</span>
                            <span className="text-[10px] uppercase font-bold">{dow}</span>
                        </button>
                    );
                }) : <p className="text-gray-500 italic">Chưa có lịch chiếu.</p>}
            </div>
            {selectedDateKey && currentShowtimes.length > 0 && (
                <div className="bg-[#151a23] p-4 rounded-xl border border-gray-800">
                    <p className="text-sm text-gray-500 mb-3 uppercase font-bold">Giờ chiếu</p>
                    <div className="flex flex-wrap gap-3">
                        {currentShowtimes.map((st) => {
                            const timeStr = new Date(st.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                            return (
                                <button key={st._id} onClick={() => setSelectedShowtimeId(st._id)} className={`px-6 py-2 rounded-lg font-bold border transition-all ${selectedShowtimeId === st._id ? "border-red-600 text-red-500 bg-red-600/10" : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"}`}>
                                    {timeStr}
                                </button>
                            );
                        })}
                    </div>
                    <p className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> {activeShowtime?.screen_name}
                    </p>
                </div>
            )}
        </div>

        {/* --- SƠ ĐỒ GHẾ --- */}
        <div className="animate-fade-in-up">
            <div className="text-center mb-10">
              <div className="relative inline-block">
                <div className="h-2 w-64 md:w-96 bg-gray-600 rounded-full mb-4 mx-auto shadow-[0_0_30px_rgba(255,255,255,0.2)]"></div>
                <p className="text-gray-600 text-xs tracking-[0.3em] uppercase">Màn hình</p>
              </div>
            </div>

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
                          <button key={seat} onClick={() => toggleSeat(seat)} disabled={isTaken} className={`w-8 h-8 md:w-9 md:h-9 rounded-t-md text-[10px] md:text-xs font-bold transition-all duration-200 ${seatStyle}`}>
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
                  {selectedSeats.length > 0 ? selectedSeats.map(s => <span key={s} className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">{s}</span>) : <span className="text-gray-500 italic">Chưa chọn</span>}
               </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <p className="text-gray-400 text-xs">Tổng cộng</p>
                  <p className="text-2xl font-bold text-white">{totalAmount.toLocaleString()} <span className="text-red-600 text-sm">đ</span></p>
               </div>
               <button onClick={handleProceedPayment} disabled={selectedSeats.length === 0} className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg">
                  TIẾP TỤC
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}