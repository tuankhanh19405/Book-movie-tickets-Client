import { Navigate } from "react-router-dom";

// Components
import MainLayout from "../components/MainLayout";

// Pages
import HomePage from "../pages/HomePage";
import AboutSection from "../pages/AboutSection";
import PromotionSection from "../pages/PromotionSection";
import ShowtimesSection from "../pages/ShowtimesSection";
import TicketPriceSection from "../pages/TicketPriceSection";

// Pages cần bảo vệ
import SeatSelection from "../pages/SeatSelection";
import PaymentPage from "../pages/PaymentPage";
import FakePaymentGateway from "../pages/FakePaymentGateway";
import PaymentQRPage from "../pages/PaymentQRPage";
import TicketSuccessPage from "../pages/TicketSuccessPage";
import UserProfile from "../pages/UserProfile";
import ProtectedRoute from "../Protected/ProtectedRoute";

const clientRoute = [{
    path: "/",
    element: <MainLayout />,
    children: [
        // 1. Redirect mặc định
        { index: true, element: <Navigate to={"/homepage"} /> },

        // ==================================================
        // 2. PUBLIC ROUTES (Ai cũng có thể truy cập)
        // ==================================================
        { path: "/homepage", Component: HomePage },
        { path: "/about", Component: AboutSection },
        { path: "/promotion", Component: PromotionSection },
        { path: "/showtimes", Component: ShowtimesSection },
        { path: "/ticket-price", Component: TicketPriceSection },
        { path: "/booking/:id", Component: SeatSelection },


        // ==================================================
        // 3. PROTECTED ROUTES (Phải đăng nhập mới vào được)
        // ==================================================
        {
            element: <ProtectedRoute />, // <--- "Người gác cổng" ở đây
            children: [
                { path: "/profile", Component: UserProfile },
                { path: "/payment", Component: PaymentPage },
                { path: "/payment-gateway", Component: FakePaymentGateway },
                { path: "/paymentQRPage", Component: PaymentQRPage },
                { path: "/ticket-success", Component: TicketSuccessPage },
            ]
        }
    ],
}]

export default clientRoute;