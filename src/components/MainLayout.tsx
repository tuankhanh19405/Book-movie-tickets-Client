import { Outlet } from "react-router-dom";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

export default function MainLayout() {
    return (
        // 1. Đổi nền sang màu tối trùng với HomePage (#0f172a) để không bị chớp trắng
        <div className="min-h-screen flex flex-col bg-[#0f172a]">
            <Header />


            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}