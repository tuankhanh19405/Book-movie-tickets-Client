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

const clientRoute = [{
    path: "/",
    element: <MainLayout />,
    children: [
        { index: true, element: <Navigate to={"/homepage"} /> },
        { path: "/homepage", Component: HomePage },
        { path: "/seatSelection", Component: SeatSelection },
        { path: "/payment", Component: PaymentPage },
        { path: "/paymentQRPage", Component: PaymentQRPage },
        { path: "/about", Component: AboutSection },
        { path: "/promotion", Component: PromotionSection },
        { path: "/showtimes", Component: ShowtimesSection },
        { path: "/ticket-price", Component: TicketPriceSection },

    ],
}]

export default clientRoute