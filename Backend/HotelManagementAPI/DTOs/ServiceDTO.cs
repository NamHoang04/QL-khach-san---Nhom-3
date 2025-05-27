namespace HotelManagementAPI.DTOs
{
    /// <summary>
    /// DTO (Data Transfer Object) cho thông tin dịch vụ trả về cho client.
    /// </summary>
    public class ServiceDTO
    {
        /// <summary>
        /// ID của dịch vụ.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Tên dịch vụ.
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Giá dịch vụ.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Mô tả dịch vụ.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Icon dịch vụ.
        /// </summary>
        public string? Icon { get; set; }

        /// <summary>
        /// Loại dịch vụ.
        /// </summary>
        public string? Category { get; set; }
    }

    /// <summary>
    /// DTO để tạo mới thông tin dịch vụ.
    /// </summary>
    public class CreateServiceDTO
    {
        /// <summary>
        /// Tên dịch vụ.
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Giá dịch vụ.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Mô tả dịch vụ.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Icon dịch vụ.
        /// </summary>
        public string? Icon { get; set; }

        /// <summary>
        /// Loại dịch vụ.
        /// </summary>
        public string? Category { get; set; }
    }

    /// <summary>
    /// DTO để cập nhật thông tin dịch vụ.
    /// </summary>
    public class UpdateServiceDTO
    {
        /// <summary>
        /// Tên dịch vụ.
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Giá dịch vụ.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Mô tả dịch vụ.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Icon dịch vụ.
        /// </summary>
        public string? Icon { get; set; }

        /// <summary>
        /// Loại dịch vụ.
        /// </summary>
        public string? Category { get; set; }
    }

    /// <summary>
    /// DTO cho thông tin dịch vụ yêu thích.
    /// </summary>
    public class FavoriteServiceDTO
    {
        /// <summary>
        /// ID khách hàng.
        /// </summary>
        public int CustomerId { get; set; }

        /// <summary>
        /// ID dịch vụ.
        /// </summary>
        public int ServiceId { get; set; }

        /// <summary>
        /// Thông tin chi tiết về dịch vụ.
        /// </summary>
        public ServiceDTO? Service { get; set; }
    }

    /// <summary>
    /// DTO cho thông tin dịch vụ đã đặt trong một booking.
    /// </summary>
    public class BookingServiceDTO
    {
        /// <summary>
        /// ID của mục dịch vụ trong booking.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// ID của booking liên quan.
        /// </summary>
        public int BookingId { get; set; }

        /// <summary>
        /// ID của dịch vụ được đặt.
        /// </summary>
        public int ServiceId { get; set; }

        /// <summary>
        /// Số lượng dịch vụ được đặt.
        /// </summary>
        public int Quantity { get; set; }

        /// <summary>
        /// Giá của dịch vụ tại thời điểm đặt.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Ghi chú cho dịch vụ đã đặt (nếu có).
        /// </summary>
        public string? Note { get; set; }

        /// <summary>
        /// Thông tin chi tiết về dịch vụ.
        /// </summary>
        public ServiceDTO? Service { get; set; }
    }
} 