import { useEffect, useState } from "react";

// --- MAIN PAGE: QR PAYMENT ---
export default function PaymentQRPage() {
  // Timer đếm ngược giả lập (bắt đầu từ 7:41 như ảnh)
  const [timeLeft, setTimeLeft] = useState(461); // 7 phút 41 giây

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-300 font-sans flex flex-col">
      <div className="flex-1 container mx-auto px-4 xl:px-0 max-w-[1200px] py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* --- CỘT TRÁI: THÔNG TIN PHIM & VÉ --- */}
          <div className="lg:col-span-2 space-y-6">

            {/* Card 1: Thông tin phim */}
            <div className="bg-[#131720] rounded-xl border border-gray-800/60 p-6 shadow-sm">
              <h2 className="text-white font-bold text-lg mb-6">Thông tin phim</h2>

              <div className="mb-6">
                <p className="text-gray-500 text-sm mb-1">Phim</p>
                <p className="text-white font-bold text-lg uppercase tracking-wide">
                  ZOOTOPIA: PHI VỤ ĐỘNG TRỜI 2-P (Lồng tiếng)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Ngày giờ chiếu</p>
                  <div className="flex gap-2 text-orange-500 font-bold text-base">
                    20:15 - 08/12/2025
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Ghế</p>
                  <p className="text-white font-bold text-base">C6</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Định dạng</p>
                  <p className="text-white font-bold text-base">2D</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Phòng chiếu</p>
                  <p className="text-white font-bold text-base">4</p>
                </div>
              </div>
            </div>

            {/* Card 2: Thông tin thanh toán (Table) */}
            <div className="bg-[#131720] rounded-xl border border-gray-800/60 p-6 shadow-sm">
              <h2 className="text-white font-bold text-lg mb-6">Thông tin thanh toán</h2>

              <div className="w-full">
                {/* Table Header */}
                <div className="grid grid-cols-4 text-sm text-gray-400 font-bold pb-4 border-b border-gray-800 mb-4">
                  <div className="col-span-2">Danh mục</div>
                  <div className="col-span-1 text-center">Số lượng</div>
                  <div className="col-span-1 text-right">Tổng tiền</div>
                </div>

                {/* Table Row */}
                <div className="grid grid-cols-4 text-sm items-center py-2">
                  <div className="col-span-2 font-bold text-white">Ghế (C6)</div>
                  <div className="col-span-1 text-center text-gray-300">1</div>
                  <div className="col-span-1 text-right text-white font-bold">80.000đ</div>
                </div>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: QR CODE & ORDER INFO --- */}
          <div className="lg:col-span-1">
            <div className="bg-[#131720] rounded-xl border border-gray-800/60 p-6 shadow-sm flex flex-col items-center text-center">

              {/* QR Title */}
              <div className="mb-4">
                <p className="text-white mb-2">Quét mã thanh toán VietQR</p>
                {/* Fake VietQR Logo */}
                <div className="h-6 flex items-center justify-center gap-1">
                  <span className="text-red-500 font-black italic text-xl tracking-tighter">Viet</span>
                  <span className="text-blue-500 font-black italic text-xl tracking-tighter">QR</span>
                </div>
              </div>

              {/* QR Image Container */}
              <div className="bg-white p-2 rounded-lg mb-4 w-48 h-48 mx-auto relative shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                {/* Placeholder QR Code */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Bank Partners */}
              <div className="flex items-center justify-center gap-2 mb-4 text-sm font-bold">
                <span className="text-blue-400">napas 247</span>
                <span className="text-gray-600">|</span>
                <div className="flex items-center text-blue-700">
                  <span className="text-red-500 mr-1">★</span> MB
                </div>
              </div>

              {/* Timer */}
              <div className="text-blue-500 font-medium mb-4">
                Thời gian thanh toán {formatTime(timeLeft)}
              </div>

              {/* Warning */}
              <div className="text-orange-500 text-xs px-2 mb-8 leading-relaxed">
                Lưu ý: Không sử dụng các ứng dụng không phải Ngân hàng, Ví điện tử để quét mã QR thanh toán như Zalo chat.
              </div>

              {/* Order Details List */}
              <div className="w-full text-left space-y-3 pt-6 border-t border-gray-800">
                <h3 className="text-white font-bold mb-4">Thông tin đơn hàng</h3>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Mã đơn hàng</span>
                  <span className="text-white font-bold">9724219</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Số tiền thanh toán</span>
                  <span className="text-white font-bold">80.000đ</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span className="text-gray-400 shrink-0">Tên tài khoản</span>
                  <span className="text-white font-bold text-right uppercase max-w-[150px]">TRUNG TAM CHIEU PHIM QUOC GIA</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span className="text-gray-400 shrink-0">Tên ngân hàng</span>
                  <span className="text-white font-bold text-right">Ngân hàng TMCP Quan Doi</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}