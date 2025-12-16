import { Outlet } from "react-router-dom";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

// 1. Import Hooks & Actions của Redux
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { closeLoginModal } from "../redux/slices/uiSlice";
import AuthModal from "../pages/AuthModal";



export default function MainLayout() {
    const dispatch = useAppDispatch();
    
    // 3. Lấy trạng thái Mở/Đóng từ Redux Store
    // Nếu biến này = true (do ProtectedRoute dispatch), Modal sẽ hiện lên
    const isLoginModalOpen = useAppSelector((state) => state.ui.isLoginModalOpen);

    return (
        <div className="min-h-screen flex flex-col bg-[#0f172a]">
            <Header />

            <main className="flex-1 flex flex-col">
                {/* Outlet là nơi hiển thị các trang con (HomePage, Profile, v.v.) */}
                <Outlet />
            </main>

            <Footer />

            {/* 4. Đặt Modal ở đây để nó nằm đè lên mọi nội dung */}
            {/* Truyền props để Modal biết khi nào hiện và làm sao để tắt */}
            <AuthModal 
                isOpen={isLoginModalOpen} 
                onClose={() => dispatch(closeLoginModal())} 
            />
        </div>
    );
}