import { Button } from 'antd';

// --- 1. Định nghĩa Data Type ---
interface PromotionItem {
  id: number;
  date: string;
  title: string;
  image: string;
}

// --- 2. Dữ liệu (Lấy chính xác từ hình ảnh trang Khuyến mãi) ---
const PROMOTION_DATA: PromotionItem[] = [
  {
    id: 1,
    date: '08/08/2025',
    title: 'BẢNG GIÁ BỎNG, NƯỚC MỚI NHẤT 2025',
    image: 'https://picsum.photos/400/220?random=10',
  },
  {
    id: 2,
    date: '16/07/2025',
    title: 'ƯU ĐÃI GIÁ VÉ 55.000Đ/VÉ 2D CHO THÀNH VIÊN U22',
    image: 'https://picsum.photos/400/220?random=11',
  },
  {
    id: 3,
    date: '31/01/2025',
    title: 'GÀ RÁN SIÊU MÊ LY ĐỒNG GIÁ CHỈ 79K CÁC SET GÀ RÁN',
    image: 'https://picsum.photos/400/220?random=12',
  },
  {
    id: 4,
    date: '31/12/2024',
    title: 'TƯNG BỪNG ƯU ĐÃI NĂM 2025 TẠI TRUNG TÂM CHIẾU PHIM QUỐC GIA',
    image: 'https://picsum.photos/400/220?random=13',
  },
  {
    id: 5,
    date: '31/12/2024',
    title: 'SPECIAL MONDAY - ĐỒNG GIÁ 50.000Đ/VÉ 2D THỨ 2 CUỐI THÁNG (TỪ 01/01/2025)',
    image: 'https://picsum.photos/400/220?random=14',
  },
  {
    id: 6,
    date: '01/07/2024',
    title: 'BẢNG GIÁ BỎNG, NƯỚC MỚI NHẤT 2024',
    image: 'https://picsum.photos/400/220?random=15',
  },
  {
    id: 7,
    date: '05/02/2024',
    title: 'CHÀO TẾT, VÉ XEM PHIM ƯU ĐÃI THẢ GA',
    image: 'https://picsum.photos/400/220?random=16',
  },
  {
    id: 8,
    date: '04/09/2019',
    title: 'SIÊU ƯU ĐÃI "PHIM THẬT HAY - COMBO THẬT ĐÃ" CHÍNH THỨC TRỞ LẠI',
    image: 'https://picsum.photos/400/220?random=17',
  },
];

// --- 3. Component Chính ---
const PromotionSection = () => {
  return (
    <div className="w-full bg-[#0f1014] text-white py-12 px-4 md:px-10 lg:px-20 min-h-screen">
      {/* Tiêu đề trang */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide">
          Khuyến mãi
        </h2>
      </div>

      {/* Grid Layout (4 cột trên PC, 2 trên tablet, 1 trên mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
        {PROMOTION_DATA.map((item) => (
          <div key={item.id} className="group cursor-pointer flex flex-col h-full">
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-lg mb-3 bg-[#1a1c24] w-full aspect-[16/10]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                loading="lazy"
              />
              {/* Overlay mờ khi hover (tuỳ chọn) */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Nội dung text */}
            <div className="flex flex-col flex-grow">
              <span className="text-[#8e94a3] text-xs font-medium mb-1.5 block">
                {item.date}
              </span>
              <h3 className="text-white font-bold text-sm uppercase leading-relaxed line-clamp-3 group-hover:text-[#3b82f6] transition-colors duration-200">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination (Nằm góc phải dưới cùng giống ảnh) */}
      <div className="flex justify-end items-center gap-4 mt-12 text-sm font-medium">
        <Button
          type="text"
          className="text-[#6b7280] hover:text-white px-2 uppercase"
          disabled
        >
          Quay lại
        </Button>
        <Button
          type="text"
          className="text-white hover:text-[#3b82f6] px-2 uppercase"
        >
          Tiếp theo
        </Button>
      </div>
    </div>
  );
};

export default PromotionSection;