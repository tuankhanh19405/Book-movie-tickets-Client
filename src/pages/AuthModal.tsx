import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Row, Col, ConfigProvider, message } from 'antd';
import { X, Mail, Lock, Phone } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginUser, registerUser } from '../redux/slices/authSlice';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.auth);
  
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [form] = Form.useForm();

  // Reset form khi mở Modal
  useEffect(() => {
    if (isOpen) {
        setMode(initialMode);
        form.resetFields();
    }
  }, [isOpen, initialMode, form]);

  const onFinish = async (values: any) => {
    if (mode === 'login') {
      const resultAction = await dispatch(loginUser({ email: values.email, password: values.password }));
      if (loginUser.fulfilled.match(resultAction)) {
        message.success('Đăng nhập thành công!');
        onClose();
      } else {
        message.error(resultAction.payload as string || 'Email hoặc mật khẩu không đúng');
      }
    } else {
      const payload = {
        username: `${values.lastname} ${values.firstname}`,
        email: values.email,
        phone: values.phone,
        password: values.password
      };
      const resultAction = await dispatch(registerUser(payload));
      if (registerUser.fulfilled.match(resultAction)) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        setMode('login');
        form.resetFields();
      } else {
        message.error(resultAction.payload as string || 'Đăng ký thất bại.');
      }
    }
  };

  // Class Tailwind hỗ trợ (vẫn giữ để căn chỉnh spacing/border)
  const inputClassName = "h-11 rounded-md border-gray-700 hover:border-red-600 focus:border-red-600"; 
  const labelStyle = { color: '#9ca3af', fontWeight: 500 };

  return (
    // 🔥 CẤU HÌNH THEME ANT DESIGN (QUAN TRỌNG)
    <ConfigProvider
      theme={{
        token: {
          // Cấu hình màu sắc chung
          colorText: '#ffffff',           // Màu chữ chính: Trắng
          colorTextPlaceholder: '#6b7280', // Màu placeholder: Xám
          colorBgContainer: '#1e293b',    // Màu nền Input: Xám xanh tối (Slate-800)
          colorBorder: '#374151',         // Màu viền: Xám tối
          colorPrimary: '#ce1212',        // Màu chủ đạo (Focus/Button): Đỏ
        },
        components: {
          Modal: {
            contentBg: '#151a23',         // Nền Modal: Đen xanh đậm (Giống ảnh)
            headerBg: '#151a23',
            titleColor: '#ffffff',
          },
          Input: {
            colorBgContainer: '#1e293b',  // Ép nền Input màu tối
            activeBorderColor: '#ce1212', // Viền khi focus màu đỏ
            hoverBorderColor: '#ce1212',  // Viền khi hover màu đỏ
            colorText: '#ffffff',         // Chữ khi gõ màu trắng
          },
          Button: {
            fontWeight: 700, // Nút đậm
          }
        },
      }}
    >
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        centered
        width={600}
        closeIcon={<X className="text-gray-400 hover:text-white transition-colors" />}
        maskClosable={true}
      >
        <div className="text-gray-200 pt-2 px-2">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">
            {mode === 'register' ? 'Đăng ký tài khoản' : 'Đăng nhập'}
          </h2>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="flex flex-col gap-2"
          >
            {mode === 'register' && (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={<span style={labelStyle}>Họ</span>}
                      name="lastname"
                      rules={[{ required: true, message: 'Nhập họ' }]}
                    >
                      {/* Xóa class bg- cố định, để ConfigProvider tự xử lý */}
                      <Input placeholder="Nguyễn" className={inputClassName} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={<span style={labelStyle}>Tên</span>}
                      name="firstname"
                      rules={[{ required: true, message: 'Nhập tên' }]}
                    >
                      <Input placeholder="Văn A" className={inputClassName} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label={<span style={labelStyle}>Số điện thoại</span>}
                  name="phone"
                  rules={[
                    { required: true, message: 'Nhập số điện thoại' },
                    { pattern: /^[0-9]+$/, message: 'SĐT không hợp lệ' }
                  ]}
                >
                  <Input 
                    prefix={<Phone size={16} className="text-gray-500 mr-2" />} 
                    placeholder="0988xxxxxx" 
                    className={inputClassName}
                  />
                </Form.Item>
              </>
            )}

            <Form.Item
              label={<span style={labelStyle}>Email</span>}
              name="email"
              rules={[{ required: true, message: 'Nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
            >
              <Input 
                prefix={<Mail size={16} className="text-gray-500 mr-2" />} 
                placeholder="example@gmail.com" 
                className={inputClassName}
              />
            </Form.Item>

            <Form.Item
              label={<span style={labelStyle}>Mật khẩu</span>}
              name="password"
              rules={[{ required: true, message: 'Nhập mật khẩu' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}
            >
              <Input.Password 
                prefix={<Lock size={16} className="text-gray-500 mr-2" />} 
                placeholder="••••••" 
                className={inputClassName}
              />
            </Form.Item>

            {mode === 'register' && (
                <Form.Item
                    label={<span style={labelStyle}>Xác nhận mật khẩu</span>}
                    name="confirm"
                    dependencies={['password']}
                    rules={[
                    { required: true, message: 'Nhập lại mật khẩu' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                        if (!value || getFieldValue('password') === value) return Promise.resolve();
                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                        },
                    }),
                    ]}
                >
                    <Input.Password 
                        prefix={<Lock size={16} className="text-gray-500 mr-2" />} 
                        placeholder="••••••" 
                        className={inputClassName}
                    />
                </Form.Item>
            )}

            {mode === 'login' && (
              <div className="flex justify-end -mt-1 mb-2">
                <span className="text-[#ce1212] text-sm cursor-pointer hover:underline font-medium">
                  Quên mật khẩu?
                </span>
              </div>
            )}

            <Button
              htmlType="submit"
              loading={isLoading}
              className="w-full bg-[#ce1212] hover:!bg-red-700 border-none text-white h-12 text-lg mt-4 rounded-lg shadow-lg shadow-red-900/30 uppercase tracking-wide"
            >
              {mode === 'login' ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'}
            </Button>

            <div className="text-center mt-6 text-sm text-gray-400">
              {mode === 'login' ? 'Bạn chưa có tài khoản?' : 'Bạn đã có tài khoản?'} {' '}
              <span
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-[#ce1212] cursor-pointer hover:underline font-bold transition-colors ml-1"
              >
                {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
              </span>
            </div>

          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default AuthModal;