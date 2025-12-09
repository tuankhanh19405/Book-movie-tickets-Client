import { Carousel } from "antd";

const HeroSlider = () => {
  // 2. Danh sách Banner (Bạn thay link ảnh Tafiti vào đây)
  const banners = [
    {
      id: 1,
      // Đây là ảnh Tafiti (Tôi dùng link demo, bạn hãy thay link thật của bạn vào)
      image: "https://media.lottecinemavn.com/Media/WebAdmin/4b256b68b824424395d9dc004a434771.jpg",
      alt: "Tafiti - Náo loạn sa mạc",
    },
    {
      id: 2,
      image: "https://chieuphimquocgia.com.vn/Content/Images/Banner/Banner%20Trang%20chu/2024/Banner%20Trang%20chu%202024.jpg",
      alt: "Banner NCC 2024",
    },
    {
      id: 3,
      image: "https://files.betacorp.vn/files/media%2fimages%2f2024%2f05%2f03%2flat-mat-7-1702x621-110306-030524-52.jpg",
      alt: "Lật mặt 7",
    },
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