namespace HotelManagementAPI.Common
{
    public static class Constants
    {
        /// <summary>
        /// URL API cơ sở
        /// </summary>
        public const string BaseApiUrl = "http://localhost:5000/api";

        /// <summary>
        /// Thông báo
        /// </summary>
        public static class Messages
        {
            // Thông báo xác thực
            public const string LoginSuccess = "Đăng nhập thành công";
            public const string LoginFailed = "Tên đăng nhập hoặc mật khẩu không đúng";
            public const string RegisterSuccess = "Đăng ký tài khoản thành công";
            public const string PasswordMismatch = "Mật khẩu xác nhận không khớp";
            public const string EmailExists = "Email đã được đăng ký";
            public const string IdentityExists = "CCCD/CMND đã được đăng ký";
            public const string Unauthorized = "Bạn không có quyền truy cập";
            public const string ServerError = "Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.";

            // Thông báo nghiệp vụ khách sạn
            public const string BookingSuccess = "Đặt phòng thành công";
            public const string BookingNotFound = "Không tìm thấy thông tin đặt phòng";
            public const string RoomNotAvailable = "Phòng không khả dụng trong thời gian đã chọn";
        }

        /// <summary>
        /// Vai trò người dùng
        /// </summary>
        public static class Roles
        {
            public const string Admin = "Admin";
            public const string Customer = "Customer";
            public const string Staff = "Staff";
        }
    }
} 