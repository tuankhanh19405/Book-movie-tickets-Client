import { Carousel } from "antd";

const HeroSlider = () => {
  // 2. Danh sách Banner (Bạn thay link ảnh Tafiti vào đây)
  const banners = [
    {
      id: 1,
      // Dune: Part Two
      image: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
      alt: "Dune: Part Two - Hành tinh cát",
    },
    {
      id: 2,
      // Inside Out 2
      image: "https://image.tmdb.org/t/p/original/xg27NrXi7VXCGUr7MG75UqLl6Vg.jpg",
      alt: "Inside Out 2 - Những mảnh ghép cảm xúc",
    },
    {
      id: 3,
      // Furiosa: A Mad Max Saga (Thay mới)
      image: "https://image.tmdb.org/t/p/original/wNAhuOZ3Zf84jCIlrcI6JhgmY5q.jpg",
      alt: "Furiosa: Câu chuyện từ Max Điên",
    },
    {
      id: 4,
      // Kingdom of the Planet of the Apes (Thay mới)
      image: "https://image.tmdb.org/t/p/original/fqv8v6AycXKsivp1T5yKtLbGXce.jpg",
      alt: "Hành tinh khỉ: Vương quốc mới",
    }
];
  const settings = {
    autoplay: true,
    autoplaySpeed: 4000,
    effect: "fade" as const,
    dots: true,
    arrows: true,
    // prevArrow: <ArrowStyle icon={<LeftOutlined />} />, // Icon trái
    // nextArrow: <ArrowStyle icon={<RightOutlined />} />, // Icon phải
  };

  return (
    <div className="w-full bg-[#0f172a] relative group">
      <Carousel {...settings} className="custom-carousel">
        {banners.map((banner) => (
          <div key={banner.id}>
            {/* Wrapper giữ tỷ lệ ảnh */}
            <div
              className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px]"
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-full object-cover object-center"
              />
              {/* Overlay mờ nhẹ bên dưới nếu cần text đè lên (tùy chọn) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Style phụ để override vị trí nút bấm của Antd cho cân đối hơn */}
      <style >{`
        .custom-carousel .slick-prev {
          left: 20px;
          z-index: 10;
        }
        .custom-carousel .slick-next {
          right: 20px;
          z-index: 10;
        }
        .custom-carousel .slick-prev:hover,
        .custom-carousel .slick-next:hover {
          background: rgba(206, 18, 18, 0.8) !important; /* Màu đỏ khi hover */
        }
      `}</style>
    </div>
  );
};
export default HeroSlider