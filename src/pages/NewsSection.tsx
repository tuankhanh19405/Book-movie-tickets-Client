import React from 'react';
import { Button } from 'antd';

// --- 1. Định nghĩa Data Types ---
interface NewsItem {
  id: number;
  date: string;
  title: string;
  image: string;
}

// --- 2. Mock Data (Dữ liệu giống hệt trong ảnh) ---
const NEWS_DATA: NewsItem[] = [
  {
    id: 1,
    date: '08/12/2025',
    title: 'LIÊN HOAN PHIM NHẬT BẢN 2025 TẠI HÀ NỘI (12/12/2025 – 27/12/2025)',
    image: 'https://picsum.photos/400/250?random=1', // Thay ảnh thật của bạn vào đây
  },
  {
    id: 2,
    date: '05/12/2025',
    title: 'VUI HỌC CÙNG PHIM – XEM PHIM HAY, NHẬN QUÀ CỰC CHILL!',
    image: 'https://picsum.photos/400/250?random=2',
  },
  {
    id: 3,
    date: '03/12/2025',
    title: 'TUẦN PHIM BA LAN TẠI HÀ NỘI 2025',
    image: 'https://picsum.photos/400/250?random=3',
  },
  {
    id: 4,
    date: '27/11/2025',
    title: '"VUI HỌC CÙNG PHIM" – HÀNH TRÌNH NƠI ĐIỆN ẢNH VỪA NUÔI DƯỠNG TÂM HỒN, VỪA KHUẤY ĐỘNG CẢM XÚC.',
    image: 'https://picsum.photos/400/250?random=4',
  },
  {
    id: 5,
    date: '14/11/2025',
    title: 'TRI ÂN THẦY CÔ - KHI ĐIỆN ẢNH KỂ CHUYỆN "NGƯỜI LÁI ĐÒ" THẦM LẶNG',
    image: 'https://picsum.photos/400/250?random=5',
  },
  {
    id: 6,
    date: '04/11/2025',
    title: 'TRUNG TÂM CHIẾU PHIM QUỐC GIA KÝ KẾT HỢP TÁC CHIẾN LƯỢC, ĐẨY MẠNH HIỆN ĐẠI HÓA VÀ SỨ MỆNH GIÁO DỤC QUA ĐIỆN ẢNH',
    image: 'https://picsum.photos/400/250?random=6',
  },
  {
    id: 7,
    date: '28/10/2025',
    title: 'SUẤT CHIẾU ĐẶC BIỆT CỦA "TỔ QUỐC TRONG TIM: THE CONCERT FILM" NGÀY 25/10 TẠI TRUNG TÂM CHIẾU PHIM QUỐC GIA',
    image: 'https://picsum.photos/400/250?random=7',
  },
  {
    id: 8,
    date: '24/10/2025',
    title: 'GIAN HÀNG TRUNG TÂM CHIẾU PHIM QUỐC GIA CHÍNH THỨC GÓP MẶT TẠI HỘI CHỢ MÙA THU 2025.',
    image: 'https://picsum.photos/400/250?random=8',
  },
];

// --- 3. Component Chính ---
const NewsSection: React.FC = () => {
  return (
    <section className="w-full bg-[#0f1014] text-white py-12 px-4 md:px-10 lg:px-20 min-h-screen">
      {/* Header Title */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Tin tức</h2>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {NEWS_DATA.map((item) => (
          <div key={item.id} className="group cursor-pointer flex flex-col h-full">
            {/* Image Wrapper */}
            <div className="overflow-hidden rounded-md mb-4 bg-[#1a1c24] relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow">
              <span className="text-[#8e94a3] text-xs font-medium mb-2 block">
                {item.date}
              </span>
              <h3 className="text-white font-bold text-sm uppercase leading-relaxed line-clamp-3 group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination (Bottom Right) */}
      <div className="flex justify-end items-center gap-2 mt-10">
        <Button
          type="default"
          className="bg-[#1a1c24] border-[#333] text-gray-400 hover:text-white hover:border-white hover:bg-transparent"
        >
          Quay lại
        </Button>
        <Button
          type="default"
          className="bg-[#1a1c24] border-[#333] text-white hover:border-white hover:bg-transparent"
        >
          Tiếp theo
        </Button>
      </div>
    </section>
  );
};

export default NewsSection;