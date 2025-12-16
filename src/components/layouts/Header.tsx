import { useState, useEffect } from "react";
import { 
  User, 
  ChevronDown, 
  Search, 
  LogOut, 
  CreditCard, 
  UserCircle 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // 1. Import Link và useNavigate
import AuthModal from "../../pages/AuthModal";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi đọc dữ liệu user:", error);
      }
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login');

  const openLogin = () => { setModalMode('login'); setIsModalOpen(true); };
  const openRegister = () => { setModalMode('register'); setIsModalOpen(true); };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    window.location.reload(); 
  };

  const navItems = [
    { label: "Trang chủ", link: "/" }, // Thêm link cho menu chính nếu cần
    { label: "Lịch chiếu", link: "/schedule" },
    { label: "Tin tức", link: "/news" },
    { label: "Khuyến mãi", link: "/promotion" },
    { label: "Giá vé", link: "/price" },
    { label: "Liên hoan phim", link: "/festival" },
    { label: "Giới thiệu", link: "/about" },
  ];

  return (
    <>
      <header className="w-full bg-[#0f1219] z-50 relative h-[80px] flex items-center font-sans border-b border-gray-800/50">
        <div className="container mx-auto px-6 flex justify-between items-center w-full max-w-[1440px]">

          {/* LOGO (Click về trang chủ) */}
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0"
            onClick={() => navigate('/')} 
          >
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center overflow-hidden relative shadow-lg">
              <div className="font-black text-2xl bg-gradient-to-br from-red-600 via-yellow-500 to-blue-600 bg-clip-text text-transparent">N</div>
            </div>
            <div className="text-white flex flex-col justify-center leading-tight">
              <span className="text-[12px] font-bold tracking-wider">NATIONAL</span>
              <span className="text-[14px] font-bold tracking-wider">CINEMA CENTER</span>
            </div>
          </div>

          {/* MENU CHÍNH */}
          <nav className="hidden xl:flex items-center flex-1 justify-center gap-8 mx-4">
            {navItems.map((item, index) => (
              // Dùng Link để chuyển trang không reload
              <Link
                key={index}
                to={item.link || "#"}
                className="text-[15px] font-medium text-gray-300 hover:text-[#e54d4d] hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* KHU VỰC PHẢI */}
          <div className="flex items-center gap-5 shrink-0">
            <button className="text-white hover:text-[#e54d4d] transition w-10 h-10 flex items-center justify-center bg-gray-800/50 rounded-full">
              <Search size={18} />
            </button>

            {user ? (
              // --- ĐÃ ĐĂNG NHẬP ---
              <div className="relative group py-2">
                <div className="flex items-center gap-3 cursor-pointer bg-gray-800/30 py-1.5 px-3 rounded-full border border-gray-700/50 hover:border-gray-500 transition">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-gray-200 shadow-inner">
                    <User size={16} />
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm font-medium pr-1">
                    <span className="whitespace-nowrap max-w-[120px] truncate">
                      {user.username || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 transition-transform duration-300" />
                  </div>
                </div>

                {/* DROPDOWN MENU */}
                <div className="absolute right-0 top-full pt-2 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50">
                  <div className="bg-[#0f172a] border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-1">
                      
                      {/* 🔥 CẬP NHẬT: Link tới trang Profile */}
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                      >
                        <UserCircle size={18} className="text-gray-400" /> 
                        Thông tin cá nhân
                      </Link>
                      
                      <Link 
                        to="/profile" // Có thể link tới cùng trang nhưng khác Tab nếu muốn
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                      >
                        <CreditCard size={18} className="text-gray-400" /> 
                        Thẻ thành viên
                      </Link>
                    </div>

                    <div className="h-[1px] bg-gray-700 mx-2 my-1"></div>

                    <div className="p-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-left"
                      >
                        <LogOut size={18} /> 
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              // --- CHƯA ĐĂNG NHẬP ---
              <div className="flex items-center gap-3">
                <button 
                    onClick={openRegister}
                    className="hidden sm:block px-5 py-2 rounded-full border border-gray-600 text-gray-300 text-sm font-semibold hover:border-white hover:text-white transition duration-300 whitespace-nowrap"
                >
                  Đăng ký
                </button>
                <button 
                    onClick={openLogin}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f87171] text-white text-sm font-semibold shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:scale-105 transition duration-300 whitespace-nowrap"
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </div>

        </div>
      </header>
      
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => {
            setIsModalOpen(false);
            if (localStorage.getItem('token') || localStorage.getItem('user')) {
                window.location.reload();
            }
        }} 
        initialMode={modalMode} 
      />
    </>
  );
};

export default Header;