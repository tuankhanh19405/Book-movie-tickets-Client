import React from 'react';
import { ConfigProvider } from 'antd';
import HeroSlider from '../components/layouts/HeroSlider';

// --- DỮ LIỆU MẪU ---

const movies = [
    {
        id: 1,
        title: "NĂM ĐÊM KINH HOÀNG 2 - T16",
        image: "https://image.tmdb.org/t/p/w500/j9mH1ispQ3x1JgA9O5Ym9p8X9v.jpg",
        genre: "Kinh dị",
        date: "05/12/2025",
    },
    {
        id: 2,
        title: "TRUY TÌM LONG DIÊN HƯƠNG",
        image: "https://image.tmdb.org/t/p/w500/ckH9deGGPXTEF2u03Y4c4fFvJ7.jpg",
        genre: "Hài",
        date: "14/11/2025",
    },
    {
        id: 3,
        title: "HOÀNG TỬ QUỶ - T18",
        image: "https://image.tmdb.org/t/p/w500/8xV47NDrjdZDpkVcCFqKDHaORdU.jpg",
        genre: "Kinh dị",
        date: "05/12/2025",
    },
    {
        id: 4,
        title: "ZOOTOPIA: PHI VỤ ĐỘNG TRỜI",
        image: "https://image.tmdb.org/t/p/w500/eKi8dIrr8voB60hwJFsrTXLGLiy.jpg",
        genre: "Hoạt hình",
        date: "28/11/2025",
    },
];

const festivalMovies = [
    {
        id: 1,
        title: "KHÚC NHẠC VINH QUANG - P - LHP BA LAN",
        image: "https://image.tmdb.org/t/p/w500/qA5kPYZA7FkVvzpKrTIqTPReh9v.jpg",
        genre: "Tâm lý",
        date: "08/12/2025",
    },
    {
        id: 2,
        title: "NGỌN LỬA HỒI SINH - T13 - LHP BA LAN",
        image: "https://image.tmdb.org/t/p/w500/r2J02Z2OpLYct2MW8WdM71qu8.jpg",
        genre: "Tâm lý",
        date: "09/12/2025",
    }
];

const upcomingMovies = [
    {
        id: 1,
        title: "THẾ HỆ KỲ TÍCH",
        image: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe850nRLRZIayaJ8tp.jpg",
        genre: "Tâm lý",
        date: "10/12/2025",
    },
    {
        id: 2,
        title: "VONG NHI: CÚP BẾ",
        image: "https://image.tmdb.org/t/p/w500/pFlaoIY8R035p65l4HlzL50qElx.jpg",
        genre: "Kinh dị",
        date: "12/12/2025",
    },
    {
        id: 3,
        title: "MẮC BẪY LŨ TÍ QUẬY",
        image: "https://image.tmdb.org/t/p/w500/hr69f155xW9c8tMvJg8L5s7z7.jpg",
        genre: "Hoạt hình",
        date: "12/12/2025",
    },
    {
        id: 4,
        title: "ANH TRAI TÔI LÀ KHỦNG LONG",
        image: "https://image.tmdb.org/t/p/w500/yrpPYKijjsMqd46u4o3Ibq05DZF.jpg",
        genre: "Hoạt hình",
        date: "12/12/2025",
    }
];

const sidebarBanners = [
    "https://image.tmdb.org/t/p/w500/t5zCBSB5xMDKcDqe91qahCOUYVV.jpg",
    "https://image.tmdb.org/t/p/w500/u3YQJctMzFN2wBdR4XHU7DCG0ac.jpg",
];

// --- COMPONENTS ---

const SectionTitle = ({ title, linkText = "Xem tất cả" }: { title: string, linkText?: string }) => (
    <div className="flex justify-between items-end mb-5 pb-2 border-b border-gray-800">
        <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#ce1212]"></div>
            <h2 className="text-xl font-bold uppercase text-white">
                {title}
            </h2>
        </div>
        <a href="#" className="text-gray-400 text-xs md:text-sm underline hover:text-[#ce1212] transition-colors">
            {linkText}
        </a>
    </div>
);

const MovieCard = ({ movie }: { movie: any }) =>  (
    <div className="group cursor-pointer flex flex-col">
        <div className="overflow-hidden rounded-lg aspect-[2/3] mb-3 relative bg-gray-800">
            <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x450?text=No+Image";
                }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button  className="bg-[#ce1212] text-white text-sm font-bold py-2 px-4 rounded uppercase transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Mua vé
                </button>
            </div>
        </div>
        <div className="flex items-center text-[11px] text-gray-500 mb-1 gap-2 font-medium">
            <span>{movie.date}</span>
        </div>
        <h3 className="text-sm md:text-base font-bold text-white uppercase leading-tight group-hover:text-[#ce1212] transition line-clamp-2">
            {movie.title}
        </h3>
    </div>
);

// --- MAIN COMPONENT ---

const HomePage = () => {
    const theme = {
        token: {
            colorPrimary: "#ce1212",
            fontFamily: "Arial, sans-serif",
        },
    };

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
                                    {movies.map((movie) => (
                                        <MovieCard key={movie.id} movie={movie} />
                                    ))}
                                </div>
                            </div>

                            {/* 2. LIÊN HOAN PHIM (ĐÃ SỬA: Dùng grid-cols-4 giống hệt bên trên) */}
                            <div className="mb-12">
                                <SectionTitle title="Liên hoan phim, Tuần phim" />
                                {/* SỬA TẠI ĐÂY: Dùng chung Grid System 4 cột */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {festivalMovies.map((movie) => (
                                        <MovieCard key={movie.id} movie={movie} />
                                    ))}
                                </div>
                            </div>

                            {/* 3. PHIM SẮP CHIẾU */}
                            <div className="mb-8">
                                <SectionTitle title="Phim sắp chiếu" />
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {upcomingMovies.map((movie) => (
                                        <MovieCard key={movie.id} movie={movie} />
                                    ))}
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
                                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x150?text=Quang+Cao";
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