import React from 'react';
import {
  BankOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';

// --- 1. Component con: Thẻ thông tin (Feature Card) ---
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-[#1a1c24] p-6 rounded-lg border border-gray-700 hover:border-red-600 transition-colors duration-300 h-full flex flex-col items-start">
    <div className="text-3xl text-red-500 mb-4 bg-red-500/10 p-3 rounded-full">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white uppercase mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-6 text-justify">
      {description}
    </p>
  </div>
);

// --- 2. Component Chính ---
const AboutSection = () => {
  return (
    <div className="w-full bg-[#0f1014] text-white py-12 px-4 md:px-10 lg:px-20 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* --- Header Title --- */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white uppercase tracking-wide border-b-2 border-red-600 inline-block pb-2">
            Giới thiệu
          </h2>
        </div>

        {/* --- Phần 1: Tổng quan & Hình ảnh --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          {/* Text Content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white uppercase text-[#3b82f6]">
              Trung tâm Chiếu phim Quốc gia
            </h3>
            <p className="text-gray-300 leading-7 text-justify">
              <span className="font-bold text-white">Trung tâm Chiếu phim Quốc gia (National Cinema Center)</span> là đơn vị sự nghiệp công lập trực thuộc Bộ Văn hóa, Thể thao và Du lịch. Được thành lập vào ngày <strong>29/12/1997</strong>, Trung tâm có chức năng tổ chức chiếu phim phục vụ các nhiệm vụ chính trị, xã hội, hợp tác quốc tế; điều tra xã hội học về nhu cầu khán giả để định hướng phát triển ngành điện ảnh; và tổ chức các hoạt động biểu diễn nghệ thuật, giải trí khác.
            </p>
            <p className="text-gray-300 leading-7 text-justify">
              Trải qua hơn 25 năm hình thành và phát triển, Trung tâm luôn là địa chỉ văn hóa tin cậy, là cầu nối đưa các tác phẩm điện ảnh đặc sắc của Việt Nam và thế giới đến gần hơn với khán giả Thủ đô.
            </p>
          </div>

          {/* Image */}
          <div className="relative rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
            <img
              src="https://picsum.photos/800/500?random=99" // Ảnh placeholder tòa nhà
              alt="Trung tâm Chiếu phim Quốc gia Building"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* --- Phần 2: Các con số & Tính năng (Grid) --- */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-white uppercase mb-6 border-l-4 border-red-600 pl-3">
            Quy mô & Cơ sở vật chất
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BankOutlined />}
              title="Quy mô phòng chiếu"
              description="Hệ thống bao gồm 14 phòng chiếu hiện đại, đa dạng từ 100 đến 400 ghế, đáp ứng nhu cầu phục vụ hàng ngàn lượt khách mỗi ngày."
            />
            <FeatureCard
              icon={<GlobalOutlined />}
              title="Công nghệ Tiên tiến"
              description="Trang bị các công nghệ chiếu phim tiên tiến nhất: 2D, 3D, âm thanh Dolby 7.1 sống động, màn hình cong cực đại mang lại trải nghiệm chân thực."
            />
            <FeatureCard
              icon={<SafetyCertificateOutlined />}
              title="Nhiệm vụ chính trị"
              description="Là nơi tổ chức thường niên các Liên hoan phim Quốc tế (HANIFF), Tuần lễ phim Quốc gia và các sự kiện ngoại giao văn hóa lớn."
            />
          </div>
        </div>

        {/* --- Phần 3: Tầm nhìn & Sứ mệnh --- */}
        <div className="bg-[#15171e] p-8 rounded-xl border border-gray-800 mb-16">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-500 uppercase mb-4 flex items-center gap-2">
                <TeamOutlined /> Tầm nhìn
              </h3>
              <p className="text-gray-400 leading-6 text-sm">
                Trở thành tổ hợp văn hóa - giải trí hàng đầu tại Việt Nam, không chỉ là nơi thưởng thức điện ảnh mà còn là không gian giao lưu văn hóa, nghệ thuật đẳng cấp quốc tế.
              </p>
            </div>
            <div className="w-px bg-gray-700 hidden md:block"></div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-500 uppercase mb-4 flex items-center gap-2">
                <CustomerServiceOutlined /> Sứ mệnh
              </h3>
              <p className="text-gray-400 leading-6 text-sm">
                Phục vụ khán giả với chất lượng dịch vụ tốt nhất, giá vé hợp lý nhất. Góp phần định hướng thẩm mỹ điện ảnh cho khán giả, đặc biệt là thế hệ trẻ.
              </p>
            </div>
          </div>
        </div>

        {/* --- Phần 4: Thông tin liên hệ (Footer Content) --- */}
        <div className="border-t border-gray-800 pt-8">
          <h3 className="text-xl font-bold text-white uppercase mb-6">Thông tin liên hệ</h3>
          <div className="flex flex-col md:flex-row gap-8 text-gray-300 text-sm">
            <div className="flex items-start gap-3">
              <EnvironmentOutlined className="text-red-500 mt-1 text-lg" />
              <div>
                <span className="font-bold text-white block mb-1">ĐỊA CHỈ:</span>
                87 Láng Hạ, Quận Ba Đình, Tp. Hà Nội
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CustomerServiceOutlined className="text-red-500 mt-1 text-lg" />
              <div>
                <span className="font-bold text-white block mb-1">HOTLINE ĐẶT VÉ:</span>
                024.3514.1791
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutSection;