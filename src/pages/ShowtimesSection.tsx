import  { useState } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';

// --- 1. Định nghĩa Types ---
interface Showtime {
  format: string; // VD: 2D Phụ đề, 2D Lồng tiếng
  times: string[];
}

interface MovieSchedule {
  id: number;
  title: string;
  image: string;
  rating: 'P' | 'K' | 'C13' | 'C16' | 'T18'; // Phân loại độ tuổi
  ratingColor: string;
  duration: string; // VD: 120 phút
  genre: string;
  showtimes: Showtime[];
}

// --- 2. Mock Data (Dữ liệu giả lập) ---
// Tạo danh sách ngày (7 ngày tới)
const generateDates = () => {
  const days = [];
  const today = new Date();
  const weekDays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      dayName: i === 0 ? 'Hôm nay' : weekDays[d.getDay()],
      dateStr: `${d.getDate()}/${d.getMonth() + 1}`,
      fullDate: d
    });
  }
  return days;
};

const DATES = generateDates();

const MOVIES: MovieSchedule[] = [
  {
    id: 1,
    title: 'MOANA 2: HÀNH TRÌNH CỦA MOANA',
    image: 'https://picsum.photos/300/450?random=20',
    rating: 'P',
    ratingColor: '#10b981', // Green
    duration: '100 phút',
    genre: 'Hoạt hình, Phiêu lưu',
    showtimes: [
      { format: '2D Phụ đề', times: ['09:00', '11:30', '14:00', '16:30', '19:00', '21:30'] },
      { format: '2D Lồng tiếng', times: ['08:30', '10:45', '13:15', '15:45'] }
    ]
  },
  {
    id: 2,
    title: 'CƯỜI XUYÊN BIÊN GIỚI (AMAZON BULLSEYE)',
    image: 'https://picsum.photos/300/450?random=21',
    rating: 'C13',
    ratingColor: '#eab308', // Yellow
    duration: '113 phút',
    genre: 'Hài, Hành động',
    showtimes: [
      { format: '2D Phụ đề', times: ['10:00', '12:15', '14:30', '19:15', '22:00'] }
    ]
  },
  {
    id: 3,
    title: 'LINH MIÊU: QUỶ NHẬP TRÀNG',
    image: 'https://picsum.photos/300/450?random=22',
    rating: 'T18',
    ratingColor: '#ef4444', // Red
    duration: '108 phút',
    genre: 'Kinh dị',
    showtimes: [
      { format: '2D Digital', times: ['18:00', '20:15', '22:30', '23:45'] }
    ]
  },
  {
    id: 4,
    title: 'MUFASA: VUA SƯ TỬ',
    image: 'https://picsum.photos/300/450?random=23',
    rating: 'P',
    ratingColor: '#10b981',
    duration: '125 phút',
    genre: 'Phiêu lưu, Gia đình',
    showtimes: [
      { format: '2D Phụ đề', times: ['09:30', '14:45'] },
      { format: '3D Lồng tiếng', times: ['17:00', '20:00'] }
    ]
  }
];

// --- 3. Helper Component: Rating Badge ---
const RatingBadge = ({ code, color }: { code: string, color: string }) => (
  <span
    className="inline-block px-2 py-0.5 rounded text-xs font-bold text-white mr-2"
    style={{ backgroundColor: color }}
  >
    {code}
  </span>
);

// --- 4. Component Chính ---
const ShowtimesSection = () => {
  const [activeDateIndex, setActiveDateIndex] = useState(0);

  return (
    <div className="w-full bg-[#0f1014] text-white py-12 px-4 md:px-10 lg:px-20 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white uppercase tracking-wide border-b-2 border-red-600 inline-block pb-2">
            Lịch chiếu
          </h2>
        </div>

        {/* Date Selector (Horizontal Scroll) */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-8 border-b border-gray-800 no-scrollbar">
          {DATES.map((date, index) => (
            <button
              key={index}
              onClick={() => setActiveDateIndex(index)}
              className={`flex flex-col items-center min-w-[80px] p-2 rounded-md transition-all duration-200 
                ${activeDateIndex === index
                  ? 'bg-red-700 text-white scale-105'
                  : 'bg-[#1a1c24] text-gray-400 hover:bg-[#27272a]'}`}
            >
              <span className="text-sm font-medium">{date.dayName}</span>
              <span className={`text-lg font-bold ${activeDateIndex === index ? 'text-white' : 'text-gray-300'}`}>
                {date.dateStr}
              </span>
            </button>
          ))}
        </div>

        {/* Movie List */}
        <div className="flex flex-col gap-8">
          {MOVIES.map((movie) => (
            <div key={movie.id} className="bg-[#15171e] rounded-lg p-4 md:p-6 flex flex-col md:flex-row gap-6 border border-[#27272a] hover:border-gray-600 transition-colors">

              {/* Poster (Left) */}
              <div className="w-full md:w-[160px] flex-shrink-0">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-auto rounded shadow-lg object-cover aspect-[2/3]"
                />
              </div>

              {/* Info & Showtimes (Right) */}
              <div className="flex-1">
                {/* Movie Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 uppercase hover:text-red-500 cursor-pointer transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-y-2 text-sm text-gray-400">
                    <RatingBadge code={movie.rating} color={movie.ratingColor} />
                    <span className="mr-3 flex items-center gap-1">
                      <ClockCircleOutlined /> {movie.duration}
                    </span>
                    <span>{movie.genre}</span>
                  </div>
                </div>

                {/* Showtime Grid */}
                <div className="flex flex-col gap-4">
                  {movie.showtimes.map((session, idx) => (
                    <div key={idx} className="border-t border-gray-800 pt-3 first:border-0 first:pt-0">
                      <div className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                        {session.format}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {session.times.map((time, tIdx) => (
                          <button
                            key={tIdx}
                            className="px-4 py-2 bg-[#1f2937] text-white border border-gray-600 rounded 
                                       hover:bg-red-600 hover:border-red-600 hover:text-white 
                                       transition-all font-medium text-sm min-w-[80px]"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Note/Legend */}
        <div className="mt-8 flex flex-wrap gap-4 text-xs text-gray-500 justify-center">
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#10b981] rounded-sm"></span> P: Mọi lứa tuổi</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#eab308] rounded-sm"></span> C13: Trên 13 tuổi</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#f97316] rounded-sm"></span> C16: Trên 16 tuổi</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#ef4444] rounded-sm"></span> T18: Trên 18 tuổi</div>
        </div>

      </div>
    </div>
  );
};

export default ShowtimesSection;