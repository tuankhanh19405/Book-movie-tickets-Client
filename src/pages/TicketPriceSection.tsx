import React from 'react';
import { Tabs } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';

// --- Styles tùy chỉnh cho Table để giống hệt bảng giá rạp phim ---
// Tailwind không hỗ trợ tốt việc kẻ bảng phức tạp nên ta dùng class kết hợp
const tableHeaderClass = "bg-[#B91C1C] text-white font-bold p-3 border border-gray-600 text-center uppercase text-sm md:text-base";
const tableCellClass = "p-3 border border-gray-700 text-center text-gray-200 text-sm md:text-base font-medium";
const tableRowClass = "hover:bg-[#1a1c24] transition-colors";

// --- 1. Component Bảng Giá 2D ---
const PriceTable2D = () => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse min-w-[800px]">
      <thead>
        <tr>
          <th className={`${tableHeaderClass} w-1/4`}>ĐỐI TƯỢNG / THỜI GIAN</th>
          <th className={`${tableHeaderClass} w-1/4`}>TRƯỚC 12:00</th>
          <th className={`${tableHeaderClass} w-1/4`}>TỪ 12:00 - 17:00</th>
          <th className={`${tableHeaderClass} w-1/4`}>SAU 17:00</th>
        </tr>
      </thead>
      <tbody>
        {/* Nhóm: Thứ 2, 4, 5 */}
        <tr className={tableRowClass}>
          <td className={`${tableCellClass} bg-[#1f2937] font-bold text-blue-400`}>
            THỨ 2, 4, 5 <br /> <span className="text-xs text-gray-400 font-normal">(Người lớn)</span>
          </td>
          <td className={tableCellClass}>50.000 đ</td>
          <td className={tableCellClass}>60.000 đ</td>
          <td className={tableCellClass}>80.000 đ</td>
        </tr>

        {/* Nhóm: Thứ 6, 7, CN & Lễ */}
        <tr className={tableRowClass}>
          <td className={`${tableCellClass} bg-[#1f2937] font-bold text-red-400`}>
            THỨ 6, 7, CN, LỄ <br /> <span className="text-xs text-gray-400 font-normal">(Người lớn)</span>
          </td>
          <td className={tableCellClass}>60.000 đ</td>
          <td className={tableCellClass}>80.000 đ</td>
          <td className={tableCellClass}>100.000 đ</td>
        </tr>

        {/* Nhóm: HSSV, U22, Người cao tuổi */}
        <tr className={tableRowClass}>
          <td className={`${tableCellClass} bg-[#1f2937] font-bold text-green-400`}>
            HSSV - U22 - NCT <br /> <span className="text-xs text-gray-400 font-normal">(Cả tuần)</span>
          </td>
          <td className={tableCellClass}>45.000 đ</td>
          <td className={tableCellClass}>50.000 đ</td>
          <td className={tableCellClass}>
            60.000 đ <br /> <span className="text-xs text-gray-400">(Trừ tối T6,7,CN,Lễ)</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
      <div className="bg-[#1a1c24] p-3 rounded border border-gray-700">
        <span className="font-bold text-red-500">PHỤ THU GHẾ VIP:</span> +15.000 đ / vé
      </div>
      <div className="bg-[#1a1c24] p-3 rounded border border-gray-700">
        <span className="font-bold text-red-500">PHỤ THU PHIM BOM TẤN:</span> +5.000 đ / vé
      </div>
    </div>
  </div>
);

// --- 2. Component Bảng Giá 3D ---
const PriceTable3D = () => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse min-w-[800px]">
      <thead>
        <tr>
          <th className={`${tableHeaderClass} w-1/4`}>THỜI GIAN</th>
          <th className={`${tableHeaderClass} w-1/4`}>THỨ 2, 4, 5</th>
          <th className={`${tableHeaderClass} w-1/4`}>THỨ 3 (VUI VẺ)</th>
          <th className={`${tableHeaderClass} w-1/4`}>THỨ 6, 7, CN, LỄ</th>
        </tr>
      </thead>
      <tbody>
        <tr className={tableRowClass}>
          <td className={`${tableCellClass} bg-[#1f2937] font-bold`}>TRƯỚC 12:00</td>
          <td className={tableCellClass}>80.000 đ</td>
          <td className={tableCellClass}>70.000 đ</td>
          <td className={tableCellClass}>90.000 đ</td>
        </tr>
        <tr className={tableRowClass}>
          <td className={`${tableCellClass} bg-[#1f2937] font-bold`}>TỪ 12:00 - 17:00</td>
          <td className={tableCellClass}>90.000 đ</td>
          <td className={tableCellClass}>80.000 đ</td>
          <td className={tableCellClass}>110.000 đ</td>
        </tr>
        <tr className={tableRowClass}>
          <td className={`${tableCellClass} bg-[#1f2937] font-bold`}>SAU 17:00</td>
          <td className={tableCellClass}>100.000 đ</td>
          <td className={tableCellClass}>80.000 đ</td>
          <td className={tableCellClass}>130.000 đ</td>
        </tr>
      </tbody>
    </table>
    <div className="mt-4 bg-[#1a1c24] p-3 rounded border border-gray-700 text-sm text-gray-300">
      <span className="font-bold text-red-500">KÍNH 3D:</span> Khách hàng tự trang bị hoặc mua tại quầy vé/bắp nước.
    </div>
  </div>
);

// --- 3. Component Chính ---
const TicketPriceSection = () => {
  // Cấu hình Tabs của Ant Design
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'PHIM 2D DIGITAL',
      children: <PriceTable2D />,
    },
    {
      key: '2',
      label: 'PHIM 3D DIGITAL',
      children: <PriceTable3D />,
    },
  ];

  return (
    <div className="w-full bg-[#0f1014] text-white py-12 px-4 md:px-10 lg:px-20 min-h-screen">
      {/* Container chính giữa (Center content) */}
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white uppercase tracking-wide border-b-2 border-red-600 inline-block pb-2">
            Giá vé
          </h2>
        </div>

        {/* Nội dung chính: Tabs Bảng Giá */}
        <div className="bg-[#0f1014] text-white">
          <Tabs
            defaultActiveKey="1"
            items={items}
            centered
            className="custom-tabs"
            // Tùy chỉnh màu sắc Tabs cho hợp Dark Mode
            tabBarStyle={{
              color: '#a1a1aa',
              borderBottom: '1px solid #374151',
              marginBottom: '2rem'
            }}
          />
        </div>

        {/* Phần quy định / Ghi chú (Footer nội dung) */}
        <div className="mt-12 bg-[#1a1c24] p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
            <InfoCircleOutlined /> QUY ĐỊNH & LƯU Ý
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm leading-6">
            <li>Giá vé trên áp dụng cho ghế thường. Ghế VIP phụ thu thêm theo quy định.</li>
            <li>Vé trẻ em: Áp dụng cho trẻ em cao dưới 1.3m. Trẻ em dưới 0.7m miễn phí (ngồi cùng người lớn).</li>
            <li>Vé HSSV / U22: Vui lòng xuất trình thẻ HSSV hoặc CMND/CCCD khi mua vé và vào phòng chiếu.</li>
            <li>Vé người cao tuổi: Áp dụng cho công dân Việt Nam từ 55 tuổi trở lên (xuất trình CMND).</li>
            <li>Không áp dụng các chế độ ưu đãi (HSSV, U22...) vào các ngày Lễ, Tết và các suất chiếu sớm (Sneak Show).</li>
            <li>Giá vé ngày Lễ/Tết sẽ áp dụng theo biểu giá riêng (tương đương ngày cuối tuần hoặc cao hơn tùy phim).</li>
          </ul>
        </div>

      </div>

      {/* CSS Override cho Ant Design Tabs trong Dark Mode */}
      <style>{`
        .custom-tabs .ant-tabs-tab {
            color: #9ca3af !important;
            font-size: 16px;
            font-weight: 600;
            padding: 12px 24px;
        }
        .custom-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #ef4444 !important; /* Red-500 */
            text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        }
        .custom-tabs .ant-tabs-ink-bar {
            background: #ef4444 !important;
            height: 3px;
        }
      `}</style>
    </div>
  );
};

export default TicketPriceSection;