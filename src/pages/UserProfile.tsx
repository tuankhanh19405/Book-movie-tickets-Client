import React, { useEffect, useState } from "react";
import { Form, Input, ConfigProvider, Spin, message } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchUserById } from "../redux/slices/authSlice"; // Import action mới
import ChangePasswordModal from "./ChangePasswordModal";

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);

  // --- 1. GỌI API KHI VÀO TRANG ---
  useEffect(() => {
    // Chỉ gọi API nếu đã có user (tức là đã đăng nhập và có _id)
    if (user && user._id) {
      dispatch(fetchUserById(user._id));
    }
  }, [dispatch]); // Bỏ 'user' khỏi dependencies để tránh loop vô hạn nếu user thay đổi

  // --- 2. ĐIỀN DỮ LIỆU VÀO FORM ---
  useEffect(() => {
    if (user) {
      const fullName = user.username || "";
      // Logic tách họ tên đơn giản (lấy từ khoảng trắng cuối cùng)
      const lastSpaceIndex = fullName.lastIndexOf(" ");
      let firstName = fullName;
      let lastName = "";

      if (lastSpaceIndex !== -1) {
        lastName = fullName.substring(0, lastSpaceIndex);
        firstName = fullName.substring(lastSpaceIndex + 1);
      } else {
        // Trường hợp tên chỉ có 1 chữ hoặc rỗng
        firstName = fullName;
        lastName = ""; 
      }

      form.setFieldsValue({
        lastname: lastName,
        firstname: firstName,
        phone: user.phone,
        address: user.address || "", 
        username: user.email?.split("@")[0], // Giả lập tên đăng nhập từ email
        email: user.email,
      });
    }
  }, [user, form]);

  // Style CSS (Giữ nguyên)
  const inputClassName = "!bg-[#151a23] !border-gray-700 !text-white hover:!border-red-600 focus:!border-red-600 h-11 rounded-lg placeholder-gray-500 font-medium";
  const disabledInputClassName = "!bg-[#0f1219] !border-gray-800 !text-gray-500 cursor-not-allowed hover:!border-gray-800";

  // Hiển thị Loading khi đang tải dữ liệu lần đầu
  if (isLoading && !user) {
    return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center"><Spin size="large" /></div>;
  }

  return (
    <ConfigProvider
      theme={{
        token: { colorText: "#ffffff", colorError: "#ff4d4f", fontFamily: "sans-serif" },
        components: { Form: { labelColor: "#ffffff", itemMarginBottom: 24 } },
      }}
    >
      <div className="min-h-screen bg-[#0b0e14] py-12 px-4 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <h1 className="text-3xl font-bold text-white text-center mb-10 uppercase tracking-wide">
            Thông tin cá nhân
          </h1>

          {/* --- TABS --- */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button className="bg-red-600 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-red-900/30 transition">
              Tài khoản của tôi
            </button>
            <button className="bg-transparent border border-gray-700 text-gray-400 px-6 py-2.5 rounded-full font-medium text-sm hover:border-gray-500 hover:text-white transition">
              Thông tin thẻ thành viên U22
            </button>
            <button className="bg-transparent border border-gray-700 text-gray-400 px-6 py-2.5 rounded-full font-medium text-sm hover:border-gray-500 hover:text-white transition">
              Lịch sử mua vé
            </button>
            <button className="bg-transparent border border-gray-700 text-gray-400 px-6 py-2.5 rounded-full font-medium text-sm hover:border-gray-500 hover:text-white transition">
              Lịch sử điểm thưởng
            </button>
          </div>

          {/* --- FORM --- */}
          <Form
            form={form}
            layout="vertical"
            className="max-w-4xl mx-auto"
            requiredMark={(label, { required }) => (
              <span className="text-white">{label} {required && <span className="text-red-600 ml-1">*</span>}</span>
            )}
            onFinish={(values) => {
                console.log("Cập nhật thông tin:", values);
                message.info("Tính năng cập nhật đang phát triển");
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div className="space-y-2">
                <Form.Item label="Họ" name="lastname" rules={[{ required: true, message: "Vui lòng nhập họ" }]}>
                  <Input className={inputClassName} />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}>
                  <Input className={inputClassName} />
                </Form.Item>
                <Form.Item label="Tên đăng nhập" name="username">
                  <Input disabled className={`${inputClassName} ${disabledInputClassName}`} />
                </Form.Item>
              </div>

              <div className="space-y-2">
                <Form.Item label="Tên" name="firstname" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                  <Input className={inputClassName} />
                </Form.Item>
                <Form.Item label="Địa chỉ" name="address">
                  <Input className={inputClassName} placeholder="Cập nhật địa chỉ..." />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input disabled className={`${inputClassName} ${disabledInputClassName}`} />
                </Form.Item>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsChangePassOpen(true)}
                className="text-white text-sm font-bold hover:text-red-500 hover:underline transition"
              >
                Đổi mật khẩu
              </button>
              
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-sm shadow-lg shadow-red-900/20 transition uppercase tracking-wide"
              >
                {isLoading ? "Đang tải..." : "Lưu thông tin"}
              </button>
            </div>
          </Form>
        </div>

        {/* Modal Đổi mật khẩu */}
        <ChangePasswordModal 
          isOpen={isChangePassOpen} 
          onClose={() => setIsChangePassOpen(false)} 
        />

      </div>
    </ConfigProvider>
  );
};

export default UserProfile;