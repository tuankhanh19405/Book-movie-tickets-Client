import React, { useEffect, useState } from "react";
import { Form, Input, ConfigProvider, Spin, message, Empty, Tag, type FormInstance } from "antd";
import { Calendar, Clock, MapPin, Ticket, User as UserIcon } from "lucide-react";

// --- IMPORTS ---
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchUserById, updateUserProfile } from "../redux/slices/authSlice";
import { fetchBookingsByUserId } from "../redux/slices/bookingSlice";
import type { User } from "../interfaces/type";
import ChangePasswordModal from "./ChangePasswordModal";

// --- STYLES ---
const inputClassName = "!bg-[#151a23] !border-gray-700 !text-white hover:!border-red-600 focus:!border-red-600 h-11 rounded-lg placeholder-gray-500 font-medium";
const disabledInputClassName = "!bg-[#0f1219] !border-gray-800 !text-gray-500 cursor-not-allowed hover:!border-gray-800";

// =========================================
// 1. COMPONENT CON: PROFILE FORM (Form Cập Nhật)
// =========================================
interface ProfileFormProps {
  form: FormInstance;
  setIsChangePassOpen: (isOpen: boolean) => void;
  onUpdate: (values: any) => void;
  isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ form, setIsChangePassOpen, onUpdate, isLoading }) => (
  <Form
    form={form}
    layout="vertical"
    className="max-w-4xl mx-auto animate-fade-in"
    requiredMark={(label, { required }) => (
      <span className="text-white">{label} {required && <span className="text-red-600 ml-1">*</span>}</span>
    )}
    onFinish={onUpdate}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
      <Form.Item label="Họ (Last Name)" name="lastname" rules={[{ required: true, message: "Vui lòng nhập họ" }]}>
        <Input className={inputClassName} placeholder="Nguyễn" />
      </Form.Item>

      <Form.Item label="Tên (First Name)" name="firstname" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
        <Input className={inputClassName} placeholder="Văn A" />
      </Form.Item>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
      <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}>
        <Input className={inputClassName} placeholder="09xxxxxxx" />
      </Form.Item>

      <Form.Item label="Email" name="email">
        <Input disabled className={`${inputClassName} ${disabledInputClassName}`} />
      </Form.Item>
    </div>

    <Form.Item label="Tên hiển thị đầy đủ (Username)" name="username_display">
      <Input disabled className={`${inputClassName} ${disabledInputClassName} opacity-70`} />
    </Form.Item>

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
        disabled={isLoading}
        className={`px-8 py-3 rounded-lg font-bold text-sm shadow-lg transition uppercase tracking-wide flex items-center justify-center gap-2
          ${isLoading 
            ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
            : "bg-red-600 hover:bg-red-700 text-white shadow-red-900/20"
          }`}
      >
        {isLoading ? <Spin size="small" /> : "Lưu thay đổi"}
      </button>
    </div>
  </Form>
);

// =========================================
// 2. COMPONENT CON: LỊCH SỬ MUA VÉ (ĐÃ SỬA LỖI DATE)
// =========================================
interface PurchaseHistoryProps {
  history: any[];
  isLoading: boolean;
}

const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({ history, isLoading }) => (
  <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
    {isLoading ? (
       <div className="flex justify-center items-center h-40">
          <Spin size="large" />
       </div>
    ) : history && history.length > 0 ? (
      history.map((ticket: any) => {
          // --- 1. XỬ LÝ TÊN PHIM & POSTER ---
          const movieName = ticket.movie_title || ticket.movie_details?.title || "Phim chưa cập nhật tên";
          const posterUrl = ticket.movie_details?.poster_url || "https://via.placeholder.com/150x220?text=No+Image";
          
          // --- 2. XỬ LÝ NGÀY CHIẾU (DATE) AN TOÀN ---
          let displayDate = "Đang cập nhật";
          
          if (ticket.date) {
            // Trường hợp 1: Date là chuỗi "DD/MM/YYYY" (VD: "08/12/2025") -> Hiển thị luôn
            if (ticket.date.includes('/')) {
                displayDate = ticket.date;
            } 
            // Trường hợp 2: Date là ISO String (VD: "2025-12-08T00:00...") -> Format lại
            else {
                const d = new Date(ticket.date);
                if (!isNaN(d.getTime())) {
                    displayDate = d.toLocaleDateString('vi-VN');
                }
            }
          } else if (ticket.created_at) {
             // Fallback: Nếu không có ngày chiếu, lấy ngày mua vé
             displayDate = new Date(ticket.created_at).toLocaleDateString('vi-VN');
          }

          // --- 3. XỬ LÝ GIỜ CHIẾU (TIME) ---
          let displayTime = ticket.time;
          // Nếu time bị lỗi hoặc không có, thử lấy từ created_at
          if (!displayTime || displayTime === "Invalid Date") {
             if (ticket.created_at) {
                displayTime = new Date(ticket.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit'});
             } else {
                displayTime = "--:--";
             }
          }
          
          // --- 4. DANH SÁCH GHẾ ---
          let seatList = "Chưa chọn ghế";
          if (Array.isArray(ticket.seats) && ticket.seats.length > 0) {
             seatList = ticket.seats.join(", "); 
          } else if (Array.isArray(ticket.tickets)) {
             seatList = ticket.tickets.map((t: any) => t.seat_name || t).join(", ");
          }

          const isConfirmed = ticket.status === 'confirmed' || ticket.status === 'success';

          return (
            <div key={ticket._id} className="bg-[#151a23] border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-6 hover:border-gray-600 transition group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -mr-5 -mt-5 pointer-events-none"></div>
              
              <div className="w-full md:w-28 h-40 shrink-0 overflow-hidden rounded-lg bg-gray-900 shadow-lg">
                 <img src={posterUrl} alt={movieName} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-lg font-bold text-white uppercase leading-tight">{movieName}</h3>
                     <Tag color={isConfirmed ? 'success' : 'blue'} className="mr-0 font-bold border-none">
                        {isConfirmed ? 'ĐÃ THANH TOÁN' : ticket.status?.toUpperCase()}
                     </Tag>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-gray-400 mt-3">
                     <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-red-600" />
                        <span>NCC Cinema</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-red-600" />
                        <span className="text-white">{displayDate}</span> {/* Đã sửa */}
                     </div>
                     <div className="flex items-center gap-2">
                        <Ticket size={14} className="text-red-600" />
                        <span className="truncate max-w-[200px]" title={seatList}>Ghế: <b className="text-white">{seatList}</b></span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Clock size={14} className="text-red-600" />
                        <span>{displayTime}</span> {/* Đã sửa */}
                     </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-end">
                   <div className="flex flex-col">
                      <span className="text-gray-600 text-[10px] uppercase font-bold">Mã vé</span>
                      <span className="text-gray-300 text-xs font-mono">{ticket._id}</span>
                   </div>
                   <span className="text-[#ce1212] font-bold text-xl">{ticket.total_amount?.toLocaleString()} đ</span>
                </div>
              </div>
            </div>
          );
      })
    ) : (
      <div className="py-16 flex flex-col items-center justify-center bg-[#151a23] rounded-xl border border-gray-800 border-dashed">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span className="text-gray-500">Bạn chưa có lịch sử đặt vé nào</span>} />
          {/* Nút đặt vé ngay chuyển hướng về trang chủ */}
          <a href="/" className="mt-4 text-red-500 hover:text-red-400 font-bold text-sm cursor-pointer">Đặt vé ngay</a>
      </div>
    )}
  </div>
);
// =========================================
// 3. COMPONENT CHÍNH: UserProfile
// =========================================

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  
  const { user, isLoading: isUserLoading } = useAppSelector((state) => state.auth) as { user: User | null, isLoading: boolean };
  const { history, status: bookingStatus } = useAppSelector((state) => state.booking);
  const isHistoryLoading = bookingStatus === 'loading';

  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'membership'>('profile');
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);

  // --- GỌI API BAN ĐẦU ---
  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchUserById(user._id));
      dispatch(fetchBookingsByUserId(user._id));
    }
  }, [dispatch, user?._id]);

  // --- FILL DATA VÀO FORM ---
  useEffect(() => {
    if (user) {
      const fullName = user.username || "";
      const lastSpaceIndex = fullName.lastIndexOf(" ");
      let firstName = fullName;
      let lastName = "";

      if (lastSpaceIndex !== -1) {
        lastName = fullName.substring(0, lastSpaceIndex);
        firstName = fullName.substring(lastSpaceIndex + 1);
      } else {
        firstName = fullName;
      }

      form.setFieldsValue({
        lastname: lastName,
        firstname: firstName,
        phone: user.phone,
        username_display: user.username,
        email: user.email,
      });
    }
  }, [user, form]);

  // --- XỬ LÝ UPDATE PROFILE ---
  const handleUpdateProfile = async (values: any) => {
    if (!user?._id) return;

    // Ghép Họ + Tên -> username mới
    const newUsername = `${values.lastname.trim()} ${values.firstname.trim()}`;

    const updateData = {
      username: newUsername,
      phone: values.phone,
    };

    try {
      await dispatch(updateUserProfile({ userId: user._id, data: updateData })).unwrap();
      message.success("Cập nhật thông tin thành công!");
      dispatch(fetchUserById(user._id)); // Refresh lại data
    } catch (error) {
      message.error("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const getTabClass = (tabName: string) => {
    return activeTab === tabName 
      ? "bg-red-600 text-white shadow-lg shadow-red-900/30 border-red-600" 
      : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white";
  };

  if (isUserLoading && !user) {
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
          
          {/* HEADER INFO */}
          <div className="text-center mb-10">
              <div className="w-24 h-24 mx-auto mb-4 relative group">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover border-2 border-gray-700 shadow-xl"/>
                  ) : (
                    <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700 shadow-xl">
                      <UserIcon size={40} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#0b0e14]">
                    {user?.roles?.[0] || "MEMBER"}
                  </div>
              </div>
              <h1 className="text-3xl font-bold text-white uppercase tracking-wide">{user?.username}</h1>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          </div>

          {/* TABS */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button onClick={() => setActiveTab('profile')} className={`px-6 py-2.5 rounded-full font-bold text-sm border transition duration-300 ${getTabClass('profile')}`}>
              Tài khoản của tôi
            </button>
            <button onClick={() => setActiveTab('history')} className={`px-6 py-2.5 rounded-full font-bold text-sm border transition duration-300 ${getTabClass('history')}`}>
              Lịch sử mua vé
            </button>
            <button className={`px-6 py-2.5 rounded-full font-bold text-sm border transition duration-300 ${getTabClass('membership')}`} onClick={() => message.info("Chức năng thẻ thành viên đang cập nhật")}>
              Thẻ thành viên U22
            </button>
          </div>

          {/* CONTENT AREA */}
          <div className="min-h-[400px]">
            {activeTab === 'profile' && (
              <ProfileForm 
                form={form} 
                setIsChangePassOpen={setIsChangePassOpen} 
                onUpdate={handleUpdateProfile}
                isLoading={isUserLoading}
              />
            )}
            {activeTab === 'history' && <PurchaseHistory history={history} isLoading={isHistoryLoading} />}
          </div>
          
        </div>

        <ChangePasswordModal isOpen={isChangePassOpen} onClose={() => setIsChangePassOpen(false)} />

      </div>
    </ConfigProvider>
  );
};

export default UserProfile;