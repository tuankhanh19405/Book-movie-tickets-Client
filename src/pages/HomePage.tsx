import React, { useEffect, useMemo } from 'react';
import { ConfigProvider } from 'antd';
import { useNavigate } from 'react-router-dom'; // <--- 1. Import useNavigate
import HeroSlider from '../components/layouts/HeroSlider';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchMovies } from '../redux/slices/movieSlice';
import type { Movie } from '../interfaces/type';

// --- COMPONENTS CON ---

const SectionTitle = ({ title, linkText = "Xem tất cả", showViewAll = true }: { title: string, linkText?: string, showViewAll?: boolean }) => (
    <div className="flex justify-between items-end mb-5 pb-2 border-b border-gray-800">
        <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#ce1212]"></div>
            <h2 className="text-xl font-bold uppercase text-white">
                {title}
            </h2>
        </div>
        {showViewAll && (
            <a href="#" className="text-gray-400 text-xs md:text-sm underline hover:text-[#ce1212] transition-colors">
                {linkText}
            </a>
        )}
    </div>
);

// ---  COMPONENT MOVIECARD ---
const MovieCard = ({ movie }: { movie: Movie }) => {
    const navigate = useNavigate(); // <--- 2. Khai báo hook chuyển trang

    // Format ngày tháng
    const formattedDate = new Date(movie.release_date).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    // Hàm xử lý chuyển hướng
    const handleBooking = (e?: React.MouseEvent) => {
        // Ngăn sự kiện nổi bọt nếu cần (để tránh conflict nếu lồng nhau)
        if (e) e.stopPropagation(); 
        
        // Chuyển hướng sang trang chọn ghế kèm ID phim
        navigate(`/booking/${movie._id}`);
    };

    return (
        // Thêm onClick vào div bao ngoài để click vào đâu trên card cũng đi mua vé được
        <div onClick={handleBooking} className="group cursor-pointer flex flex-col h-full">
            <div className="overflow-hidden rounded-lg aspect-[2/3] mb-3 relative bg-gray-800">
                <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Ngăn lặp vô hạn
                        target.src = "https://placehold.co/300x450?text=No+Image"; // Dùng placehold.co ổn định hơn
                    }}
                />
                
                {/* Overlay nút mua vé */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                        // <--- 3. Gắn sự kiện vào nút
                        onClick={handleBooking} 
                        className="bg-[#ce1212] text-white text-sm font-bold py-2 px-4 rounded uppercase transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-700"
                    >
                        Mua vé
                    </button>
                </div>

                {/* Badge Rating */}
                <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                    {movie.rating_stats.average} ★
                </div>
            </div>
            
            <div className="flex items-center text-[11px] text-gray-500 mb-1 gap-2 font-medium">
                <span>{formattedDate}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span className="truncate max-w-[100px]">{movie.genres?.[0]}</span>
            </div>
            
            <h3 className="text-sm md:text-base font-bold text-white uppercase leading-tight group-hover:text-[#ce1212] transition line-clamp-2">
                {movie.title}
            </h3>
        </div>
    );
};

// --- MAIN PAGE ---

const HomePage = () => {
    const dispatch = useAppDispatch();
    const { list: movieList, isLoading } = useAppSelector((state) => state.movies);

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);

    const { nowShowing, upcoming, festivals } = useMemo(() => {
        if (!movieList || movieList.length === 0) return { nowShowing: [], upcoming: [], festivals: [] };

        return {
            nowShowing: movieList.filter(m => m.status === 'released' || m.status === 'now_showing'),
            upcoming: movieList.filter(m => m.status === 'coming_soon'),
            festivals: movieList.filter(m => m.genres.includes('Drama')).slice(0, 4)
        };
    }, [movieList]);

    const sidebarBanners = [
        "https://image.tmdb.org/t/p/w500/t5zCBSB5xMDKcDqe91qahCOUYVV.jpg",
        "https://image.tmdb.org/t/p/w500/u3YQJctMzFN2wBdR4XHU7DCG0ac.jpg",
    ];

    const theme = {
        token: {
            colorPrimary: "#ce1212",
            fontFamily: "Arial, sans-serif",
        },
    };

    if (isLoading) {
        return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Đang tải phim...</div>;
    }

    return (
        <ConfigProvider theme={theme}>
            <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">
               
                <HeroSlider />

                <div className="flex-grow container mx-auto px-4 py-10">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* --- LEFT COLUMN (75%) --- */}
                        <div className="w-full lg:w-3/4">
                            
                            {/* 1. PHIM ĐANG CHIẾU */}
                            <div className="mb-12">
                                <SectionTitle title="Phim đang chiếu" />
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {nowShowing.length > 0 ? (
                                        nowShowing.map((movie) => (
                                            <MovieCard key={movie._id} movie={movie} />
                                        ))
                                    ) : (
                                        <p className="text-gray-500 col-span-4">Chưa có phim đang chiếu.</p>
                                    )}
                                </div>
                            </div>

                            {/* 2. LIÊN HOAN PHIM */}
                            <div className="mb-12">
                                <SectionTitle title="Liên hoan phim, Tuần phim" />
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {festivals.length > 0 ? (
                                        festivals.map((movie) => (
                                            <MovieCard key={movie._id} movie={movie} />
                                        ))
                                    ) : (
                                        <p className="text-gray-500 col-span-4">Đang cập nhật sự kiện.</p>
                                    )}
                                </div>
                            </div>

                            {/* 3. PHIM SẮP CHIẾU */}
                            <div className="mb-8">
                                <SectionTitle title="Phim sắp chiếu" />
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {upcoming.length > 0 ? (
                                        upcoming.map((movie) => (
                                            <MovieCard key={movie._id} movie={movie} />
                                        ))
                                    ) : (
                                        <p className="text-gray-500 col-span-4">Sắp có phim mới cập bến!</p>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* --- RIGHT COLUMN (25%) --- */}
                        <div className="w-full lg:w-1/4 flex flex-col gap-6">
                            <SectionTitle title="Khuyến mãi & Sự kiện" showViewAll={false} />
                            
                            {sidebarBanners.map((imgUrl, index) => (
                                <div key={index} className="overflow-hidden rounded-lg border border-gray-800 cursor-pointer group relative">
                                    <img 
                                        src={imgUrl} 
                                        alt="Banner" 
                                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = "https://placehold.co/300x150?text=Quang+Cao";
                                        }}
                                    />
                                </div>
                            ))}

                             <div className="text-right mt-2">
                                <a href="#" className="text-[#ce1212] text-sm font-bold hover:underline">XEM TẤT CẢ &gt;&gt;</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default HomePage;