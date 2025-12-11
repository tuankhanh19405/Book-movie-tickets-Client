import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

// Import các actions từ Redux
import { fetchMovies } from "../redux/slices/movieSlice";
import { setBookingInfo, fetchBookedSeats } from "../redux/slices/bookingSlice";

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // --- 1. LẤY DỮ LIỆU TỪ REDUX STORE ---
  const { list: movies, isLoading: isMovieLoading } = useAppSelector((state) => state.movies);
  const { bookedSeats } = useAppSelector((state) => state.booking);

  const movie = useMemo(() => movies.find((m) => m._id === id), [movies, id]);

  // --- 2. LOCAL STATE ---
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("08/12/2025");
  const [selectedTime, setSelectedTime] = useState("23:05");

  // --- CẤU HÌNH RẠP & GIÁ VÉ ---
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 14;
  
  // Định nghĩa hàng ghế VIP
  const vipRows = ["F", "G", "H"]; 
  const PRICE_STANDARD = 60000;
  const PRICE_VIP = 80000;

  // --- LOGIC TÍNH TỔNG TIỀN ĐỘNG ---
  const totalAmount = useMemo(() => {
    return selectedSeats.reduce((total, seat) => {
      const row = seat.charAt(0); // Lấy ký tự hàng (VD: "F" từ "F1")
      const price = vipRows.includes(row) ? PRICE_VIP : PRICE_STANDARD;
      return total + price;
    }, 0);
  }, [selectedSeats]);

  // --- 3. EFFECTS ---
  useEffect(() => {
    if (movies.length === 0) {
      dispatch(fetchMovies());
    }
  }, [dispatch, movies.length]);

  useEffect(() => {
    if (id) {
      setSelectedSeats([]); 
      dispatch(fetchBookedSeats({
        movieId: id,
        date: selectedDate,
        time: selectedTime
      }));
    }
  }, [dispatch, id, selectedDate, selectedTime]);

  // --- 4. HANDLERS ---
  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleProceedPayment = () => {
    if (!movie) return;

    // Lưu thông tin vào Redux
    dispatch(setBookingInfo({
        movie: movie,
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeats,
        totalAmount: totalAmount // Sử dụng tổng tiền đã tính toán chính xác
    }));

    navigate("/payment");
  };

  const dates = [
    { day: "08", dateFull: "08/12/2025", dow: "Thứ hai" },
    { day: "09", dateFull: "09/12/2025", dow: "Thứ ba" },
    { day: "10", dateFull: "10/12/2025", dow: "Thứ tư" },
    { day: "11", dateFull: "11/12/2025", dow: "Thứ năm" },
  ];

  // --- 5. RENDER ---
  if (isMovieLoading) return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-white">Đang tải...</div>;
  if (!movie) return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-red-500">Không tìm thấy phim!</div>;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-200 font-sans pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* --- HEADER PHIM (GIỮ NGUYÊN) --- */}
        <div className="flex flex-col md:flex-row gap-8 mb-10 bg-[#151a23] p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="w-full md:w-1/4 max-w-[200px] shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl relative group">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x450?text=No+Image"; }}
              />
              <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded shadow-md">
                {movie.rating_stats?.average || "T16"} ★
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-white uppercase leading-tight">{movie.title}</h1>
            <div className="text-sm text-gray-400 space-y-1">
              <p><strong className="text-white">Thể loại:</strong> {movie.genres?.join(", ")}</p>
              <p><strong className="text-white">Đạo diễn:</strong> {movie.director}</p>
              <p><strong className="text-white">Khởi chiếu:</strong> {new Date(movie.release_date).toLocaleDateString('vi-VN')}</p>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 md:line-clamp-none border-t border-gray-800 pt-4 mt-2">
               {movie.description}
            </p>
          </div>
        </div>

        {/* --- CHỌN NGÀY GIỜ --- */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {dates.map((item) => (
              <button
                key={item.day}
                onClick={() => setSelectedDate(item.dateFull)}
                className={`
                  flex flex-col items-center justify-center w-20 h-20 rounded-lg border-2 transition-all
                  ${selectedDate === item.dateFull 
                    ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/50 scale-105" 
                    : "bg-[#151a23] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"}
                `}
              >
                <span className="text-2xl font-bold">{item.day}</span>
                <span className="text-[10px] uppercase font-bold">{item.dow}</span>
              </button>
            ))}
          </div>
          
          <div className="bg-[#151a23] p-4 rounded-xl border border-gray-800">
             <p className="text-sm text-gray-500 mb-3 uppercase font-bold tracking-wider">Suất chiếu</p>
             <div className="flex gap-3">
                {["19:00", "20:15", "23:05"].map((time) => (
                    <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                            px-6 py-2 rounded-lg font-bold border transition-all
                            ${selectedTime === time
                                ? "border-red-600 text-red-500 bg-red-600/10" 
                                : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"}
                        `}
                    >
                        {time}
                    </button>
                ))}
             </div>
          </div>
        </div>

        {/* --- SƠ ĐỒ GHẾ --- */}
        <div className="animate-fade-in-up">
            <div className="text-center mb-10">
              <div className="relative inline-block">
                <div className="h-2 w-64 md:w-96 bg-gray-600 rounded-full mb-4 mx-auto shadow-[0_0_30px_rgba(255,255,255,0.2)]"></div>
                <p className="text-gray-600 text-xs tracking-[0.3em] uppercase">Màn hình</p>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-b from-white/5 to-transparent pointer-events-none perspective-lg rotate-x-12"></div>
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
                        
                        // Kiểm tra loại ghế
                        const isVIP = vipRows.includes(row);
                        const isTaken = bookedSeats.includes(seat);
                        const isSelected = selectedSeats.includes(seat);

                        let seatStyle = "bg-[#2b303b] border-b-2 border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white cursor-pointer";
                        
                        if (isTaken) {
                            seatStyle = "bg-red-900/20 border-transparent text-transparent cursor-not-allowed"; 
                        } else if (isSelected) {
                            seatStyle = "bg-red-600 border-red-800 text-white shadow-[0_0_15px_rgba(220,38,38,0.6)] transform scale-110 z-10"; 
                        } else if (isVIP) {
                            seatStyle = "bg-[#2b303b] border-yellow-600 text-yellow-500 hover:bg-gray-600 hover:text-white"; 
                        }

                        return (
                          <button
                            key={seat}
                            onClick={() => toggleSeat(seat)}
                            disabled={isTaken}
                            className={`w-8 h-8 md:w-9 md:h-9 rounded-t-md text-[10px] md:text-xs font-bold transition-all duration-200 ${seatStyle}`}
                            title={isVIP ? `VIP - 80.000đ` : `Thường - 60.000đ`}
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

            {/* Chú thích giá */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-gray-400 border-t border-gray-800 pt-6">
              <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#2b303b] rounded border-b-2 border-gray-600"></div> Thường (60k)</div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#2b303b] rounded border-b-2 border-yellow-600"></div> VIP (80k)</div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 bg-red-600 rounded shadow"></div> Đang chọn</div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 bg-red-900/20 rounded"></div> Đã bán</div>
            </div>
        </div>

      </div>

      {/* --- FOOTER FIXED: TỔNG TIỀN CHÍNH XÁC --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#151a23]/95 backdrop-blur-md border-t border-gray-800 p-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            
            <div className="hidden sm:block">
               <p className="text-gray-400 text-xs uppercase tracking-wide">Ghế đang chọn</p>
               <div className="flex flex-wrap gap-2 mt-1">
                  {selectedSeats.length > 0 ? (
                      selectedSeats.map(s => {
                        const isVip = vipRows.includes(s.charAt(0));
                        return (
                          <span key={s} className={`text-white text-xs font-bold px-2 py-0.5 rounded ${isVip ? 'bg-yellow-600' : 'bg-red-600'}`}>
                            {s}
                          </span>
                        )
                      })
                  ) : <span className="text-white font-bold italic">Chưa chọn ghế</span>}
               </div>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
               <div className="text-right">
                  <p className="text-gray-400 text-xs uppercase">Tổng cộng</p>
                  <p className="text-2xl font-bold text-white">
                     {totalAmount.toLocaleString()} <span className="text-red-600 text-sm">VNĐ</span>
                  </p>
               </div>
               
               <button
                  onClick={handleProceedPayment}
                  disabled={selectedSeats.length === 0}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-red-900/50 uppercase tracking-wide"
               >
                  Tiếp tục
               </button>
            </div>
         </div>
      </div>

    </div>
  );
}