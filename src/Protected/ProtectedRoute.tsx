import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Spin, Result, Button, ConfigProvider } from 'antd';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { openLoginModal } from '../redux/slices/uiSlice'; // Import action mở modal

const ProtectedRoute = () => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 1. Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  // 2. CHƯA ĐĂNG NHẬP -> Hiện thông báo + Nút mở Modal
  if (!user) {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorTextHeading: "#ffffff",
            colorTextDescription: "#9ca3af",
            colorPrimary: "#ce1212",
          },
        }}
      >
        <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center px-4">
          <div className="bg-[#151a23] p-8 rounded-2xl border border-gray-800 shadow-2xl max-w-lg w-full animate-fade-in-up">
            <Result
              status="403"
              title="Yêu cầu đăng nhập"
              subTitle="Bạn cần đăng nhập thành viên để truy cập nội dung này."
              extra={[
                <Button 
                  type="primary" 
                  key="login" 
                  size="large"
                  className="bg-red-600 hover:!bg-red-700 font-bold w-full mb-3 h-12 rounded-lg"
                  // 🔥 THAY ĐỔI Ở ĐÂY: Mở Modal thay vì chuyển trang
                  onClick={() => dispatch(openLoginModal())}
                >
                  ĐĂNG NHẬP NGAY
                </Button>,
                <Button 
                  key="home" 
                  size="large"
                  className="bg-transparent border-gray-600 text-gray-300 hover:!border-white hover:!text-white w-full h-12 rounded-lg"
                  onClick={() => navigate('/')}
                >
                  Về trang chủ
                </Button>
              ]}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }

  // 3. ĐÃ ĐĂNG NHẬP -> Cho phép xem nội dung
  return <Outlet />;
};

export default ProtectedRoute;