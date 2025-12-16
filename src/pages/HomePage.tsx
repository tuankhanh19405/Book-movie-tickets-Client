import React, { useEffect, useMemo } from 'react';
import { ConfigProvider } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import HeroSlider from '../components/layouts/HeroSlider';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchMovies } from '../redux/slices/movieSlice';
import { fetchShowtimes } from '../redux/slices/showtimeSlice';
import type { Movie } from '../interfaces/type';


const SectionTitle = ({
    title,
    linkText = "Xem tất cả",
    showViewAll = true,
    linkTo = "#"
}: {
    title: string,
    linkText?: string,
    showViewAll?: boolean,
    linkTo?: string
}) => (
    <div className="flex justify-between items-end mb-5 pb-2 border-b border-gray-800">
        <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#ce1212]"></div>
            <h2 className="text-xl font-bold uppercase text-white">
                {title}
            </h2>
        </div>
        {showViewAll && (
            <Link to={linkTo} className="text-gray-400 text-xs md:text-sm underline hover:text-[#ce1212] transition-colors">
                {linkText}
            </Link>
        )}
    </div>
);

const MovieCard = ({ movie }: { movie: Movie }) => {
    const navigate = useNavigate();

    const formattedDate = movie.release_date
        ? new Date(movie.release_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : 'Đang cập nhật';

    const handleBooking = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        navigate(`/booking/${movie._id}`);
    };

    return (
        <div onClick={handleBooking} className="group cursor-pointer flex flex-col h-full">
            <div className="overflow-hidden rounded-lg aspect-[2/3] mb-3 relative bg-gray-800">
                <img
                    src={movie.poster_url || "https://placehold.co/300x450?text=No+Image"}
                    alt={movie.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://placehold.co/300x450?text=Error";
                    }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <button
                        onClick={handleBooking}
                        className="bg-[#ce1212] text-white text-sm font-bold py-2 px-6 rounded shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-700 active:scale-95"
                    >
                        MUA VÉ
                    </button>
                </div>
                {movie.rating_stats && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded shadow-md z-20">
                        {movie.rating_stats.average || 0} ★
                    </div>
                )}
            </div>
            <div className="flex items-center text-[11px] text-gray-400 mb-1 gap-2 font-medium">
                <span>{formattedDate}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span className="truncate max-w-[120px]" title={movie.genres?.[0]}>
                    {movie.genres?.[0] || "Phim rạp"}
                </span>
            </div>
            <h3 className="text-sm md:text-base font-bold text-white uppercase leading-snug group-hover:text-[#ce1212] transition-colors line-clamp-2" title={movie.title}>
                {movie.title}
            </h3>
        </div>
    );
};

// --- MAIN PAGE ---
const HomePage = () => {
    const dispatch = useAppDispatch();

    // 2. Lấy danh sách phim VÀ danh sách lịch chiếu từ Redux
    const { list: movieList, isLoading: isMovieLoading } = useAppSelector((state) => state.movies);
    const { list: showtimeList, isLoading: isShowtimeLoading } = useAppSelector((state) => state.showtimes);

    // 3. Gọi API khi component mount
    useEffect(() => {
        dispatch(fetchMovies());
        dispatch(fetchShowtimes()); // Gọi thêm API Showtimes
    }, [dispatch]);

    // 4. Logic lọc phim: Chỉ hiện phim có lịch chiếu & giới hạn 16 phim
    const { nowShowing, upcoming, festivals } = useMemo(() => {
        if (!movieList || movieList.length === 0) return { nowShowing: [], upcoming: [], festivals: [] };

        // Tạo một Set chứa các ID phim có trong bảng Showtimes để tra cứu cho nhanh (O(1))
        const movieIdsWithShowtimes = new Set(showtimeList.map(st => st.movie_id));

        // Lọc Phim đang chiếu
        const filteredNowShowing = movieList.filter(m => {
            const isReleased = m.status === 'released' || m.status === 'now_showing';
            // Điều kiện: Phải là trạng thái 'released' VÀ có ID trong danh sách lịch chiếu
            const hasShowtime = movieIdsWithShowtimes.has(m._id);
            return isReleased && hasShowtime;
        });

        return {
            // Cắt mảng chỉ lấy 16 phim đầu tiên
            nowShowing: filteredNowShowing.slice(0, 16),

            // Phim sắp chiếu (thường chưa có lịch chiếu nên không cần lọc theo showtime)
            upcoming: movieList.filter(m => m.status === 'coming_soon').slice(0, 8),

            festivals: movieList.filter(m => m.genres?.includes('Drama')).slice(0, 4)
        };
    }, [movieList, showtimeList]);

    const sidebarBanners = [
        "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    ];

    const theme = {
        token: {
            colorPrimary: "#ce1212",
            fontFamily: "Arial, sans-serif",
            colorText: "#ffffff",
        },
    };

    if (isMovieLoading || isShowtimeLoading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white gap-4">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <p>Đang tải dữ liệu phim...</p>
            </div>
        );
    }

    return (
        <ConfigProvider theme={theme}>
            <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">

                <HeroSlider />

                <div className="flex-grow container mx-auto px-4 py-10 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* --- LEFT COLUMN (Content chính - 75%) --- */}
                        <div className="w-full lg:w-3/4">

                            {/* 1. PHIM ĐANG CHIẾU (ĐÃ CÓ LỊCH) */}
                            <div className="mb-12">
                                <SectionTitle
                                    title="Phim đang chiếu"
                                    linkText="Xem tất cả >>"
                                    linkTo="/movies/now-showing" // 5. Link tới trang danh sách đầy đủ
                                />
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {nowShowing.length > 0 ? (
                                        nowShowing.map((movie) => (
                                            <MovieCard key={movie._id} movie={movie} />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-10 bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                                            <p className="text-gray-400">Hiện chưa có phim nào có lịch chiếu.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 2. LIÊN HOAN PHIM */}
                            {festivals.length > 0 && (
                                <div className="mb-12">
                                    <SectionTitle title="Liên hoan phim & Sự kiện" showViewAll={false} />
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {festivals.map((movie) => (
                                            <MovieCard key={movie._id} movie={movie} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 3. PHIM SẮP CHIẾU */}
                            <div className="mb-8">
                                <SectionTitle
                                    title="Phim sắp chiếu"
                                    linkTo="/movies/coming-soon"
                                />
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {upcoming.length > 0 ? (
                                        upcoming.map((movie) => (
                                            <MovieCard key={movie._id} movie={movie} />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-10 bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                                            <p className="text-gray-400">Sắp có phim mới cập bến!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* --- RIGHT COLUMN (Sidebar - 25%) --- */}
                        <div className="w-full lg:w-1/4 flex flex-col gap-6">
                            <div>
                                <SectionTitle title="Khuyến mãi & Sự kiện" showViewAll={false} />
                                <div className="flex flex-col gap-4">
                                    {sidebarBanners.map((imgUrl, index) => (
                                        <div key={index} className="overflow-hidden rounded-lg border border-gray-800 cursor-pointer group shadow-lg">
                                            <img
                                                src={imgUrl}
                                                alt="Banner Quảng Cáo"
                                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-right mt-3">
                                    <Link to="/promotions" className="text-[#ce1212] text-xs font-bold hover:underline tracking-wide">
                                        XEM TẤT CẢ &gt;&gt;
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default HomePage;