import React, { useState, useEffect } from "react";
import { User, ChevronDown, Search } from "lucide-react";

const Header = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Lỗi parse user", e);
      }
    }
  }, []);

  const handleLoginObj = () => {
    const fakeUser = { name: "Phan Khanh" };
    localStorage.setItem("user", JSON.stringify(fakeUser));
    setUser(fakeUser);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  const navItems = [
    { label: "Trang chủ", isActive: false },
    { label: "Lịch chiếu", isActive: false },
    { label: "Tin tức", isActive: false },
    { label: "Khuyến mãi", isActive: false },
    { label: "Giá vé", isActive: false },
    { label: "Liên hoan phim", isActive: false }, // Đã rút gọn tên để đỡ dài
    { label: "Giới thiệu", isActive: false },
  ];

  return (
    <header className="w-full bg-[#0f1219] z-50 relative h-[80px] flex items-center font-sans border-b border-gray-800/50">
      {/* Thêm max-w-[1440px] để container rộng hơn trên màn hình to 
         justify-between: Căn đều 3 phần (Trái - Giữa - Phải)
      */}
      <div className="container mx-auto px-6 flex justify-between items-center w-full max-w-[1440px]">

        {/* --- 1. LOGO SECTION --- */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={handleLoginObj}>
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center overflow-hidden relative shadow-lg">
            <div className="font-black text-2xl bg-gradient-to-br from-red-600 via-yellow-500 to-blue-600 bg-clip-text text-transparent">
              N
            </div>
          </div>
          <div className="text-white flex flex-col justify-center leading-tight">
            <span className="text-[12px] font-bold tracking-wider">NATIONAL</span>
            <span className="text-[14px] font-bold tracking-wider">CINEMA CENTER</span>
          </div>
        </div>

        {/* --- 2. NAVIGATION MENU (ĐÃ SỬA CSS) --- */}
        {/* flex-1: Chiếm lấy khoảng trống ở giữa
            justify-center: Căn menu ra giữa trung tâm
            gap-8: Khoảng cách giữa các chữ là 32px (đều và thoáng)
        */}
        <nav className="hidden xl:flex items-center flex-1 justify-center gap-8 mx-4">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`
                text-[15px] font-medium transition-all duration-200 whitespace-nowrap
                ${item.isActive ? "text-[#e54d4d]" : "text-gray-300 hover:text-[#e54d4d] hover:-translate-y-0.5"}
              `}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* --- 3. RIGHT SECTION --- */}
        <div className="flex items-center gap-5 shrink-0">
          <button className="text-white hover:text-[#e54d4d] transition w-10 h-10 flex items-center justify-center bg-gray-800/50 rounded-full">
            <Search size={18} />
          </button>

          {user ? (
            <div className="flex items-center gap-3 cursor-pointer group relative bg-gray-800/30 py-1.5 px-3 rounded-full border border-gray-700/50 hover:border-gray-500 transition">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-gray-200 shadow-inner">
                <User size={16} />
              </div>
              <div className="flex items-center gap-2 text-white text-sm font-medium pr-1">
                <span className="whitespace-nowrap">{user.name}</span>
                <ChevronDown size={14} className="text-gray-400 group-hover:text-white transition" />
              </div>

              {/* Dropdown Logout */}
              <div className="absolute top-full right-0 mt-3 w-40 bg-[#1a1f2b] border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden transform origin-top-right">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-red-600/20 transition flex items-center gap-2"
                >
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button className="hidden sm:block px-5 py-2 rounded-full border border-gray-600 text-gray-300 text-sm font-semibold hover:border-white hover:text-white transition duration-300 whitespace-nowrap">
                Đăng ký
              </button>
              <button className="px-5 py-2 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f87171] text-white text-sm font-semibold shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:scale-105 transition duration-300 whitespace-nowrap">
                Đăng nhập
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;