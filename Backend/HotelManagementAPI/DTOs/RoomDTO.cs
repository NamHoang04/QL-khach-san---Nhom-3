namespace HotelManagementAPI.DTOs
{
    /// <summary>
    /// DTO (Data Transfer Object) cho thông tin phòng trả về cho client.
    /// </summary>
    public class RoomDTO
    {
        /// <summary>
        /// ID của phòng.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Số phòng.
        /// </summary>
        public string RoomNumber { get; set; } = string.Empty;

        /// <summary>
        /// ID của loại phòng.
        /// </summary>
        public int RoomTypeId { get; set; }

        /// <summary>
        /// Số tầng.
        /// </summary>
        public int? Floor { get; set; }

        /// <summary>
        /// Giá phòng.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Trạng thái phòng.
        /// </summary>
        public string? Status { get; set; }

        /// <summary>
        /// Tên loại phòng.
        /// </summary>
        public string? RoomTypeName { get; set; }

        /// <summary>
        /// Cờ nổi bật.
        /// </summary>
        public bool IsFeatured { get; set; }

        /// <summary>
        /// Phần trăm giảm giá.
        /// </summary>
        public int? DiscountPercent { get; set; }

        /// <summary>
        /// Giá gốc (trước giảm giá).
        /// </summary>
        public decimal? OriginalPrice { get; set; }

        /// <summary>
        /// Đánh giá sao.
        /// </summary>
        public double? Rating { get; set; }
    }

    /// <summary>
    /// DTO để tạo mới thông tin phòng.
    /// </summary>
    public class CreateRoomDTO
    {
        /// <summary>
        /// Số phòng.
        /// </summary>
        public string RoomNumber { get; set; } = string.Empty;

        /// <summary>
        /// ID loại phòng.
        /// </summary>
        public int RoomTypeId { get; set; }

        /// <summary>
        /// Số tầng.
        /// </summary>
        public int? Floor { get; set; }

        /// <summary>
        /// Giá phòng.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Trạng thái phòng.
        /// </summary>
        public string? Status { get; set; }

        /// <summary>
        /// Cờ nổi bật.
        /// </summary>
        public bool IsFeatured { get; set; }

        /// <summary>
        /// Phần trăm giảm giá.
        /// </summary>
        public int? DiscountPercent { get; set; }

        /// <summary>
        /// Giá gốc (trước giảm giá).
        /// </summary>
        public decimal? OriginalPrice { get; set; }

        /// <summary>
        /// Đánh giá sao.
        /// </summary>
        public double? Rating { get; set; }
    }

    /// <summary>
    /// DTO để cập nhật thông tin phòng.
    /// </summary>
    public class UpdateRoomDTO
    {
        /// <summary>
        /// Số phòng.
        /// </summary>
        public string RoomNumber { get; set; } = string.Empty;

        /// <summary>
        /// ID loại phòng.
        /// </summary>
        public int RoomTypeId { get; set; }

        /// <summary>
        /// Số tầng.
        /// </summary>
        public int? Floor { get; set; }

        /// <summary>
        /// Giá phòng.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Trạng thái phòng.
        /// </summary>
        public string? Status { get; set; }

        /// <summary>
        /// Cờ nổi bật.
        /// </summary>
        public bool IsFeatured { get; set; }

        /// <summary>
        /// Phần trăm giảm giá.
        /// </summary>
        public int? DiscountPercent { get; set; }

        /// <summary>
        /// Giá gốc (trước giảm giá).
        /// </summary>
        public decimal? OriginalPrice { get; set; }

        /// <summary>
        /// Đánh giá sao.
        /// </summary>
        public double? Rating { get; set; }
    }

    /// <summary>
    /// DTO cho thông tin phòng yêu thích.
    /// </summary>
    public class FavoriteRoomDTO
    {
        /// <summary>
        /// ID khách hàng.
        /// </summary>
        public int CustomerId { get; set; }

        /// <summary>
        /// ID phòng.
        /// </summary>
        public int RoomId { get; set; }

        /// <summary>
        /// Thông tin chi tiết về phòng.
        /// </summary>
        public RoomDTO? Room { get; set; }
    }
} 