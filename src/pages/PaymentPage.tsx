import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CreditCard, QrCode, Smartphone } from "lucide-react"; // Thêm icon cho sinh động
import { useAppSelector } from "../redux/hooks"; 
import { message } from "antd";

export default function PaymentPage() {
  const navigate = useNavigate();
  
  // 1. Lấy dữ liệu Booking từ Redux Store
  const { currentBooking } = useAppSelector((state) => state.booking);

  // Mặc định chọn VNPAY để người dùng thấy tính năng thanh toán online trước
  const [selectedMethod, setSelectedMethod] = useState<string>("vnpay");
  const [agreed, setAgreed] = useState(false);

  // 2. Bảo vệ Route: Nếu F5 mất dữ liệu -> Về trang chủ
  useEffect(() => {
    if (!currentBooking) {
      message.warning("Vui lòng chọn ghế trước khi thanh toán!");
      navigate("/");
    }
  }, [currentBooking, navigate]);

  if (!currentBooking) return null;

  const { movie, seats, totalAmount, date, time } = currentBooking;

  // Danh sách phương thức thanh toán
  const paymentMethods = [
    { 
      id: "vnpay", 
      name: "VNPAY / Thẻ ATM / Visa", 
      desc: "Thanh toán qua cổng VNPAY (Khuyên dùng)",
      icon: <CreditCard size={20} className="text-blue-500"/>,
      type: "gateway" // Loại chuyển cổng thanh toán
    },
    { 
      id: "vietqr", 
      name: "VietQR (Chuyển khoản)", 
      desc: "Quét mã QR qua ứng dụng ngân hàng",
      icon: <QrCode size={20} className="text-red-500"/>,
      type: "qr" // Loại quét mã
    },
    { 
      id: "momo", 
      name: "Ví MoMo", 
      desc: "Quét mã qua ứng dụng MoMo",
      icon: <Smartphone size={20} className="text-pink-600"/>,
      type: "qr" // Loại quét mã
    },
  ];

  // --- 🔥 LOGIC QUAN TRỌNG: ĐIỀU HƯỚNG THEO PHƯƠNG THỨC ---
  const handleConfirmPayment = () => {
    if (!agreed) {
        message.error("Vui lòng đồng ý điều khoản trước khi thanh toán");
        return;
    }

    // Tìm phương thức đang chọn
    const method = paymentMethods.find(m => m.id === selectedMethod);

    if (method?.type === 'gateway') {
        // CASE 1: Nếu là Cổng thanh toán (VNPAY) -> Sang trang Giả lập nhập thẻ
        // Truyền kèm state currentBooking để bên kia hiển thị số tiền
        navigate("/payment-gateway", { state: currentBooking });
    } else {
        // CASE 2: Nếu là VietQR/MoMo -> Sang trang hiện ảnh QR
        navigate("/paymentQRPage", { state: { ...currentBooking, method: selectedMethod } });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-200 font-sans pb-20 pt-10">

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* CỘT TRÁI: THÔNG TIN VÉ */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#151a23] p-6 rounded-xl border border-gray-800 shadow-sm">
            <h2 className="text-white font-bold text-lg mb-6 uppercase tracking-wide border-l-4 border-red-600 pl-3">
                Thông tin đặt vé
            </h2>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
               <img 
                 src={movie?.poster_url} 
                 alt={movie?.title} 
                 className="w-32 h-48 object-cover rounded-lg shadow-lg mx-auto md:mx-0" 
               />
               <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white uppercase">{movie?.title}</h3>
                    <span className="text-xs bg-yellow-500 text-black font-extrabold px-2 py-0.5 rounded mt-2 inline-block">
                        {movie?.rating_stats?.average || "T16"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                        <p className="text-gray-500">Rạp chiếu</p>
                        <p className="text-white font-bold">NCC Center - Rạp 5</p>
                     </div>
                     <div>
                        <p className="text-gray-500">Suất chiếu</p>
                        <p className="text-[#e54d4d] font-bold text-lg">{time} - {date}</p>
                     </div>
                     <div>
                        <p className="text-gray-500">Ghế chọn</p>
                        <p className="text-white font-bold text-lg">{seats.join(", ")}</p>
                     </div>
                     <div>
                        <p className="text-gray-500">Combo bắp nước</p>
                        <p className="text-white font-bold">Chưa chọn</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase">Tổng tiền vé</span>
                <span className="text-2xl text-[#e54d4d] font-bold">{totalAmount?.toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: PHƯƠNG THỨC THANH TOÁN */}
        <div className="lg:col-span-1">
          <div className="bg-[#151a23] p-6 rounded-xl border border-gray-800 shadow-sm sticky top-4">
            <h2 className="text-white font-bold text-lg mb-6 uppercase tracking-wide border-l-4 border-red-600 pl-3">
                Thanh toán
            </h2>

            {/* List methods */}
            <div className="space-y-3 mb-8">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`
                    relative flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200
                    ${selectedMethod === method.id
                      ? "border-red-600 bg-[#1c222e] shadow-md shadow-red-900/10"
                      : "border-gray-700 hover:border-gray-500 bg-[#11141b]"}
                  `}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    {method.icon}
                  </div>

                  {/* Name & Desc */}
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${selectedMethod === method.id ? "text-white" : "text-gray-300"}`}>
                        {method.name}
                    </p>
                    <p className="text-xs text-gray-500">{method.desc}</p>
                  </div>

                  {/* Check Icon */}
                  <div className={`
                    w-5 h-5 rounded-full border flex items-center justify-center
                    ${selectedMethod === method.id ? "border-red-600 bg-red-600" : "border-gray-600"}
                  `}>
                    {selectedMethod === method.id && <Check size={12} className="text-white" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Tổng tiền Final */}
            <div className="bg-[#0b0e14] p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400 text-sm">Thành tiền</span>
                    <span className="text-white font-bold">{totalAmount?.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Khuyến mãi</span>
                    <span className="text-green-500 font-bold">-0đ</span>
                </div>
                <div className="border-t border-gray-800 mt-3 pt-3 flex justify-between items-center">
                    <span className="text-white font-bold">Tổng thanh toán</span>
                    <span className="text-[#ce1212] font-bold text-xl">{totalAmount?.toLocaleString()}đ</span>
                </div>
            </div>

            {/* Điều khoản */}
            <div className="flex gap-3 mb-6 items-start">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`
                  w-5 h-5 rounded border border-gray-500 flex-shrink-0 cursor-pointer flex items-center justify-center mt-0.5 transition-colors
                  ${agreed ? "bg-red-600 border-red-600" : "bg-transparent hover:border-white"}
                `}
              >
                {agreed && <Check size={14} className="text-white" />}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed select-none cursor-pointer" onClick={() => setAgreed(!agreed)}>
                Tôi đồng ý với <span className="text-[#e54d4d]">Điều khoản sử dụng</span> và xác nhận mua vé cho người xem đúng độ tuổi quy định.
              </p>
            </div>

            {/* Button Actions */}
            <div className="space-y-3">
              <button
                onClick={handleConfirmPayment}
                disabled={!agreed}
                className={`
                    w-full font-bold py-3.5 rounded-lg transition-all shadow-lg uppercase tracking-wide text-sm flex items-center justify-center gap-2
                    ${agreed 
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:scale-[1.02] hover:shadow-red-900/30" 
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"}
                `}
              >
                <CreditCard size={18} />
                Thanh toán ngay
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full text-gray-400 hover:text-white font-medium py-2 transition text-sm"
              >
                Quay lại chọn ghế
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}