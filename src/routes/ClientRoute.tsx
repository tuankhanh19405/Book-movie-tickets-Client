import MainLayout from "../components/MainLayout";
import HomePage from "../pages/HomePage";
import SeatSelection from "../pages/SeatSelection";
import PaymentPage from "../pages/PaymentPage";
import { Navigate } from "react-router-dom";
import PaymentQRPage from "../pages/PaymentQRPage";
import AboutSection from "../pages/AboutSection";
import PromotionSection from "../pages/PromotionSection";
import ShowtimesSection from "../pages/ShowtimesSection";
import TicketPriceSection from "../pages/TicketPriceSection";
import TicketSuccessPage from "../pages/TicketSuccessPage";
import UserProfile from "../pages/UserProfile";
import FakePaymentGateway from "../pages/FakePaymentGateway";

const clientRoute = [{
    path: "/",
    element: <MainLayout />,
    children: [
        { index: true, element: <Navigate to={"/homepage"} /> },
        { path: "/homepage", Component: HomePage },
        { path: "/booking/:id", Component: SeatSelection },
        { path: "/payment", Component: PaymentPage },
        { path: "/payment-gateway", Component: FakePaymentGateway },
        { path: "/paymentQRPage", Component: PaymentQRPage },
        { path: "/ticket-success", Component: TicketSuccessPage },
        { path: "/about", Component: AboutSection },
        { path: "/promotion", Component: PromotionSection },
        { path: "/showtimes", Component: ShowtimesSection },
        { path: "/ticket-price", Component: TicketPriceSection },
        { path: "/profile", Component: UserProfile },

    ],
}]

export default clientRoute