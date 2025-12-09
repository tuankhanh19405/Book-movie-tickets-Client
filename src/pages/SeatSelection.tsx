import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function BookingPage() {
  const navigate = useNavigate()
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState("08")
  const [selectedTime, setSelectedTime] = useState("23:05")

  // Cấu hình ghế
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  const seatsPerRow = 14
  const ticketPrice = 60000 // Giá vé tham khảo NCC

  const toggleSeat = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    )
  }

  // Danh sách ngày (Mô phỏng dữ liệu từ ảnh)
  const dates = [
    { day: "08", dow: "Thứ hai" },
    { day: "09", dow: "Thứ ba" },
    { day: "10", dow: "Thứ tư" },
    { day: "11", dow: "Thứ năm" },
  ]

  return (
    <div className="min-h-screen bg-[#111] text-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* PHẦN 1: THÔNG TIN PHIM (Giống ảnh chụp) */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm">
          {/* Poster */}
          <div className="w-full md:w-1/4 max-w-[240px] shrink-0">
            <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden shadow-2xl relative">
              <img
                src="https://chieuphimquocgia.com.vn/Content/Images/02125556-9e4a-4720-9669-775e54c0e0b7.jpg" // Placeholder poster, bạn có thể thay ảnh thật
                alt="Poster"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">T16</div>
            </div>
          </div>

          {/* Chi tiết */}
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-bold text-white uppercase mb-2">PHÒNG TRỌ MA BẦU - T16 <span className="text-base font-normal border border-white/30 px-2 py-0.5 rounded ml-2">2D</span></h1>

            <div className="text-sm text-gray-300 space-y-1">
              <p><strong>Thể loại:</strong> Tâm lý, tình cảm, Kinh dị</p>
              <p><strong>Quốc gia:</strong> Việt Nam | <strong>Thời lượng:</strong> 101 phút</p>
              <p><strong>Đạo diễn:</strong> Nguy Minh Khang</p>
              <p><strong>Diễn viên:</strong> Huỳnh Phương, Anh Tú, Phương Lan, Cát Phượng, Lý Hùng...</p>
              <p><strong>Khởi chiếu:</strong> 28/11/2025</p>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                Hai người bạn thân thuê phải một căn phòng trọ cũ, nơi liên tục xảy ra những hiện tượng kỳ bí. Trong hành trình tìm hiểu, họ đối mặt với hồn ma của một người phụ nữ mang thai...
              </p>
            </div>

            <div className="text-red-500 text-sm italic pt-2">
              Kiểm duyệt: T16 - Phim được phổ biến đến người xem từ đủ 16 tuổi trở lên (16+)
            </div>
          </div>
        </div>

        {/* PHẦN 2: CHỌN NGÀY & GIỜ (Giống thanh lịch chiếu ở giữa ảnh) */}
        <div className="mb-10">
          <div className="bg-[#1a1a1a] p-1 rounded-t-lg inline-flex">
            {dates.map((date) => (
              <button
                key={date.day}
                onClick={() => setSelectedDate(date.day)}
                className={`
                  flex flex-col items-center justify-center w-20 h-20 transition-all
                  ${selectedDate === date.day ? "bg-red-600 text-white" : "hover:bg-gray-800 text-gray-400"}
                `}
              >
                <span className="text-2xl font-bold">{date.day}</span>
                <span className="text-xs uppercase">{date.dow}</span>
              </button>
            ))}
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-b-lg rounded-tr-lg w-full border-t-2 border-red-600">
            <div className="flex gap-4 items-center">
              <span className="text-gray-400 text-sm uppercase font-bold tracking-widest">Suất chiếu:</span>
              <button
                onClick={() => setSelectedTime("23:05")}
                className={`
                    px-6 py-2 rounded border transition-all text-lg font-bold
                    ${selectedTime === "23:05"
                    ? "border-red-600 text-red-500 bg-red-600/10"
                    : "border-gray-600 text-gray-400 hover:border-gray-400"}
                  `}
              >
                23:05
              </button>
            </div>
          </div>
        </div>

        {/* PHẦN 3: SƠ ĐỒ GHẾ (Giao diện đặt vé) */}
        {selectedTime && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <div className="h-2 w-96 bg-gray-500 rounded-full mb-2 mx-auto shadow-[0_0_20px_rgba(255,255,255,0.3)]"></div>
                <p className="text-gray-500 text-sm tracking-[0.2em] uppercase">Màn hình</p>
                {/* Hiệu ứng ánh sáng màn hình */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-80 h-16 bg-gradient-to-b from-white/10 to-transparent pointer-events-none transform perspective-lg rotate-x-12"></div>
              </div>
            </div>

            <div className="overflow-x-auto pb-12">
              <div className="min-w-[800px] flex flex-col items-center gap-3">
                {rows.map((row) => (
                  <div key={row} className="flex items-center gap-4">
                    <span className="w-6 text-center text-gray-500 font-bold">{row}</span>
                    <div className="flex gap-2">
                      {[...Array(seatsPerRow)].map((_, i) => {
                        const seat = `${row}${i + 1}`
                        const isVIP = ["F", "G", "H"].includes(row) // Hàng VIP giả định
                        const isTaken = Math.random() > 0.85
                        const isSelected = selectedSeats.includes(seat)

                        // Màu sắc ghế theo phong cách tối giản/phẳng
                        let seatColor = "bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600" // Thường
                        if (isTaken) seatColor = "bg-red-900/40 border-transparent text-transparent cursor-not-allowed" // Đã bán
                        if (isSelected) seatColor = "bg-red-600 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]" // Đang chọn
                        else if (isVIP && !isTaken) seatColor = "bg-gray-700 border-yellow-600/50 text-yellow-500 hover:bg-gray-600" // VIP

                        return (
                          <button
                            key={seat}
                            onClick={() => !isTaken && toggleSeat(seat)}
                            disabled={isTaken}
                            className={`
                                    w-8 h-8 rounded-t-lg text-[10px] font-bold border-b-2 transition-all duration-200
                                    ${seatColor}
                                `}
                          >
                            {!isTaken ? i + 1 : "X"}
                          </button>
                        )
                      })}
                    </div>
                    <span className="w-6 text-center text-gray-500 font-bold">{row}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chú thích ghế */}
            <div className="flex justify-center gap-6 mb-8 text-sm text-gray-400">
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-700 rounded-sm border-b-2 border-gray-600"></div> Thường</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-700 rounded-sm border-b-2 border-yellow-600/50"></div> VIP</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-600 rounded-sm"></div> Đang chọn</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-900/40 rounded-sm"></div> Đã bán</div>
            </div>

            {/* Footer Thanh toán */}
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 shadow-2xl z-50">
              <div className="max-w-5xl mx-auto flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">Ghế đã chọn:</p>
                  <p className="text-white font-bold text-lg truncate max-w-md">
                    {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn ghế"}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Tổng cộng:</p>
                    <p className="text-2xl font-bold text-red-500">
                      {(selectedSeats.length * ticketPrice).toLocaleString()} đ
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/payment")}
                    disabled={selectedSeats.length === 0}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded font-bold transition uppercase tracking-wider"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Spacer cho footer cố định */}
      <div className="h-24"></div>
    </div>
  )
}