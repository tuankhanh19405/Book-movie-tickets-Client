import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check } from "lucide-react"

export default function PaymentPage() {
  const navigate = useNavigate()

  // State quản lý phương thức thanh toán và điều khoản
  const [selectedMethod, setSelectedMethod] = useState<string>("vietqr")
  const [agreed, setAgreed] = useState(false)

  // Dữ liệu giả lập từ ảnh
  const movieInfo = {
    title: "TRUY TÌM LONG DIÊN HƯƠNG-T16",
    time: "18:00 - 08/12/2025",
    seat: "A5",
    format: "2D",
    room: "12",
    price: 80000
  }

  const paymentMethods = [
    { id: "vietqr", name: "VietQR", logoColor: "text-red-500" },
    { id: "vnpay", name: "VNPAY", logoColor: "text-blue-500" },
    { id: "viettel", name: "Viettel Money", logoColor: "text-red-600" },
    { id: "momo", name: "MoMo", logoColor: "text-pink-600" },
  ]

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-200 font-sans pb-20">

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* CỘT TRÁI: THÔNG TIN PHIM & VÉ */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card 1: Thông tin phim */}
          <div className="bg-[#151a23] p-6 rounded-xl border border-gray-800 shadow-sm">
            <h2 className="text-white font-bold text-lg mb-6">Thông tin phim</h2>

            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-1">Phim</p>
              <p className="text-white font-bold text-xl uppercase">{movieInfo.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Ngày giờ chiếu</p>
                <div className="flex gap-2 text-orange-500 font-bold">
                  {movieInfo.time}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Ghế</p>
                <p className="text-white font-bold">{movieInfo.seat}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Định dạng</p>
                <p className="text-white font-bold">{movieInfo.format}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Phòng chiếu</p>
                <p className="text-white font-bold">{movieInfo.room}</p>
              </div>
            </div>
          </div>

          {/* Card 2: Thông tin thanh toán (Table) */}
          <div className="bg-[#151a23] p-6 rounded-xl border border-gray-800 shadow-sm">
            <h2 className="text-white font-bold text-lg mb-6">Thông tin thanh toán</h2>

            <div className="w-full">
              <div className="grid grid-cols-3 text-sm text-gray-400 font-bold pb-4 border-b border-gray-700 mb-4">
                <div className="col-span-1">Danh mục</div>
                <div className="col-span-1 text-center">Số lượng</div>
                <div className="col-span-1 text-right">Tổng tiền</div>
              </div>

              <div className="grid grid-cols-3 text-sm items-center">
                <div className="col-span-1 font-bold text-white">Ghế ({movieInfo.seat})</div>
                <div className="col-span-1 text-center text-gray-300">1</div>
                <div className="col-span-1 text-right text-white font-bold">{movieInfo.price.toLocaleString()}đ</div>
              </div>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: THANH TOÁN */}
        <div className="lg:col-span-1">
          <div className="bg-[#151a23] p-6 rounded-xl border border-gray-800 shadow-sm sticky top-4">
            <h2 className="text-white font-bold text-lg mb-6">Phương thức thanh toán</h2>

            {/* List methods */}
            <div className="space-y-3 mb-8">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`
                    relative flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all
                    ${selectedMethod === method.id
                      ? "border-red-600 bg-[#1c222e]"
                      : "border-gray-700 hover:border-gray-500 bg-[#11141b]"}
                  `}
                >
                  {/* Radio Icon simulation */}
                  <div className={`
                    w-5 h-5 rounded-full border flex items-center justify-center
                    ${selectedMethod === method.id ? "border-red-600" : "border-gray-500"}
                  `}>
                    {selectedMethod === method.id && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                  </div>

                  {/* Fake Logo + Name */}
                  <div className="flex items-center gap-3">
                    {/* Placeholder icon */}
                    <span className={`font-bold text-sm ${method.logoColor}`}>●●</span>
                    <span className="font-medium text-white">{method.name}</span>
                  </div>

                  {/* Tick icon top-right (giống ảnh) */}
                  {selectedMethod === method.id && (
                    <div className="absolute top-[-1px] right-[-1px] bg-red-600 text-white rounded-bl-lg rounded-tr-lg p-0.5">
                      <Check size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chi phí */}
            <h2 className="text-white font-bold text-lg mb-4">Chi phí</h2>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Thanh toán</span>
                <span className="text-white font-bold">{movieInfo.price.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phí</span>
                <span className="text-white font-bold">0đ</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-700">
                <span className="text-gray-400 font-bold">Tổng cộng</span>
                <span className="text-white font-bold text-lg">{movieInfo.price.toLocaleString()}đ</span>
              </div>
            </div>

            {/* Điều khoản */}
            <div className="flex gap-3 mb-6">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`
                  w-5 h-5 rounded border border-gray-500 flex-shrink-0 cursor-pointer flex items-center justify-center mt-0.5
                  ${agreed ? "bg-red-600 border-red-600" : "bg-transparent"}
                `}
              >
                {agreed && <Check size={14} className="text-white" />}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tôi xác nhận các thông tin đã chính xác và đồng ý với các <a href="#" className="text-blue-500 hover:underline">điều khoản & chính sách</a>
              </p>
            </div>

            {/* Button Actions */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/paymentQRPage")}
                disabled={!agreed}
                className="w-full bg-red-700 hover:bg-red-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-full transition shadow-lg"
              >
                Thanh toán
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full text-gray-400 hover:text-white font-medium py-2 transition flex items-center justify-center gap-1"
              >
                Quay lại
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}