import React, { useState } from 'react';
import { Modal, Form, Input, Button, ConfigProvider, message } from 'antd';
import { X, Lock } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    // --- GIẢ LẬP GỌI API ĐỔI MẬT KHẨU ---
    setTimeout(() => {
      console.log("Dữ liệu đổi mật khẩu:", values);
      message.success("Đổi mật khẩu thành công!");
      setLoading(false);
      form.resetFields(); // Xóa trắng form
      onClose(); // Đóng modal
    }, 1500);
  };

  // Style chung cho ô nhập liệu (Dark Mode)
  const inputStyle = "!bg-[#1e293b] !border-gray-700 !text-white hover:!border-red-600 focus:!border-red-600 h-11 rounded-lg placeholder-gray-500";
  const labelStyle = { color: '#e5e7eb', fontWeight: 500 }; // Màu chữ label trắng xám

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            contentBg: '#0f1219', // Nền Modal màu đen đậm (Giống ảnh)
            headerBg: '#0f1219',
            titleColor: '#ffffff',
          },
        },
      }}
    >
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        centered
        width={500}
        closeIcon={<X className="text-gray-400 hover:text-white transition-colors" />}
        title={<span className="text-xl font-bold uppercase">Đổi mật khẩu</span>}
        maskClosable={false} // Bắt buộc bấm nút X hoặc Hủy mới đóng
      >
        <div className="pt-4">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="flex flex-col gap-3"
          >
            {/* 1. Mật khẩu hiện tại */}
            <Form.Item
              label={<span style={labelStyle}>Mật khẩu hiện tại</span>}
              name="currentPassword"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
            >
              <Input.Password 
                placeholder="Mật khẩu hiện tại" 
                className={inputStyle}
                prefix={<Lock size={16} className="text-gray-500 mr-2" />}
                style={{ backgroundColor: '#1e293b', color: 'white' }}
              />
            </Form.Item>

            {/* 2. Mật khẩu mới */}
            <Form.Item
              label={<span style={labelStyle}>Mật khẩu mới</span>}
              name="newPassword"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
              ]}
            >
              <Input.Password 
                placeholder="Mật khẩu mới" 
                className={inputStyle}
                prefix={<Lock size={16} className="text-gray-500 mr-2" />}
                style={{ backgroundColor: '#1e293b', color: 'white' }}
              />
            </Form.Item>

            {/* 3. Xác nhận mật khẩu mới */}
            <Form.Item
              label={<span style={labelStyle}>Xác nhận mật khẩu mới</span>}
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                placeholder="Xác nhận mật khẩu mới" 
                className={inputStyle}
                prefix={<Lock size={16} className="text-gray-500 mr-2" />}
                style={{ backgroundColor: '#1e293b', color: 'white' }}
              />
            </Form.Item>

            {/* Nút Hành động */}
            <Button
              htmlType="submit"
              loading={loading}
              className="w-full bg-[#ce1212] hover:!bg-red-700 border-none text-white font-bold h-12 text-lg mt-4 rounded-lg shadow-lg shadow-red-900/30 uppercase tracking-wide transition-all"
            >
              Xác nhận
            </Button>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default ChangePasswordModal;