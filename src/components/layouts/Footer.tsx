import { FacebookFilled, YoutubeFilled } from "@ant-design/icons";

const Footer = () => {
  // Danh sách menu footer
  const footerLinks = [
    "Chính sách",
    "Lịch chiếu",
    "Tin tức",
    "Giá vé",
    "Hỏi đáp",
    "Đặt vé nhóm, tập thể",
    "Liên hệ",
  ];

  return (
    <footer className="bg-[#0b0f19] text-[#b3b3b3] py-10 font-sans border-t border-gray-800">
      <div className="container mx-auto px-4 flex flex-col items-center">

        {/* 1. MENU LINKS */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
          {footerLinks.map((link, index) => (
            <a
              key={index}
              href="#"
              className="text-[14px] hover:text-white transition duration-300 font-medium"
            >
              {link}
            </a>
          ))}
        </div>

        {/* 2. ICONS & APP STORES */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a href="#" className="bg-[#3b5998] w-8 h-8 rounded flex items-center justify-center text-white hover:opacity-80">
              <FacebookFilled className="text-xl" />
            </a>

            {/* Zalo (Dùng ảnh icon vì Antd không có Zalo) */}
            <a href="#" className="w-8 h-8 rounded-full bg-white overflow-hidden hover:opacity-80">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" className="w-full h-full" />
            </a>

            {/* Youtube */}
            <a href="#" className="bg-[#c4302b] w-8 h-8 rounded flex items-center justify-center text-white hover:opacity-80">
              <YoutubeFilled className="text-xl" />
            </a>
          </div>

          {/* App Stores */}
          <div className="flex items-center gap-3">
            {/* Google Play Image */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              className="h-9 cursor-pointer border border-gray-600 rounded"
            />
            {/* App Store Image */}
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="h-9 cursor-pointer"
            />
          </div>

          {/* Bộ Công Thương Badge */}
          <div>
            <img
              src="http://online.gov.vn/Content/EndUser/Logo/dathongbao-bocongthuong.png"
              alt="Đã thông báo bộ công thương"
              className="h-10 cursor-pointer"
            />
          </div>
        </div>

        {/* 3. THÔNG TIN PHÁP LÝ (TEXT CENTER) */}
        <div className="text-center space-y-2 text-[13px] leading-relaxed text-gray-400">
          <p className="uppercase text-white font-semibold">
            Cơ quan chủ quản: BỘ VĂN HÓA, THỂ THAO VÀ DU LỊCH
          </p>
          <p>Bản quyền thuộc Trung tâm Chiếu phim Quốc gia.</p>
          <p>
            Giấy phép số: 224/GP- TTĐT ngày 31/8/2010 - Chịu trách nhiệm: Vũ Đức Tùng – Giám đốc.
          </p>
          <p>
            Địa chỉ: Số 87 Láng Hạ, Phường Ô Chợ Dừa, TP.Hà Nội - Điện thoại: 024.35141791
          </p>
          <p className="pt-2 text-gray-500 text-xs">
            Copyright 2023. NCC All Rights Reserved. Dev by Anvui.vn
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;