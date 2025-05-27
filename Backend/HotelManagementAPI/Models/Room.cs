using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    /// <summary>
    /// Đại diện cho thông tin phòng khách sạn trong hệ thống.
    /// </summary>
    public class Room
    {
        /// <summary>
        /// Khóa chính tự tăng của phòng.
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        /// <summary>
        /// Số phòng hoặc tên phòng duy nhất.
        /// </summary>
        [Required]
        [StringLength(10)]
        [Column("room_number")]
        public string RoomNumber { get; set; } = string.Empty;
        
        /// <summary>
        /// ID của loại phòng (liên kết với bảng RoomType).
        /// </summary>
        [Required]
        [Column("room_type_id")]
        public int RoomTypeId { get; set; }
        
        /// <summary>
        /// Số tầng của phòng (có thể null).
        /// </summary>
        [Column("floor")]
        public int? Floor { get; set; }
        
        /// <summary>
        /// Giá cơ bản của phòng.
        /// </summary>
        [Required]
        [Column("price", TypeName = "decimal(15,2)")]
        public decimal Price { get; set; }
        
        /// <summary>
        /// Trạng thái hiện tại của phòng (ví dụ: Sẵn sàng, Đang sử dụng, Bảo trì).
        /// </summary>
        [StringLength(50)]
        [Column("status")]
        public string? Status { get; set; } // Sẵn sàng, Đang sử dụng, Bảo trì
        
        /// <summary>
        /// Cờ đánh dấu phòng có nổi bật trên trang chủ không.
        /// </summary>
        [Column("is_featured")]
        public bool IsFeatured { get; set; } = false;
        
        /// <summary>
        /// Phần trăm giảm giá cho phòng (có thể null nếu không giảm giá).
        /// </summary>
        [Column("discount_percent")]
        public int? DiscountPercent { get; set; }
        
        /// <summary>
        /// Giá gốc trước khi giảm giá (có thể null nếu không giảm giá).
        /// </summary>
        [Column("original_price", TypeName = "decimal(15,2)")]
        public decimal? OriginalPrice { get; set; }
        
        /// <summary>
        /// Đánh giá sao của phòng (có thể null nếu chưa có đánh giá).
        /// </summary>
        [Column("rating")]
        public double? Rating { get; set; }
        
        // Navigation properties
        /// <summary>
        /// Loại phòng tương ứng (liên kết qua RoomTypeId).
        /// </summary>
        [ForeignKey("RoomTypeId")]
        public virtual RoomType? RoomType { get; set; }
        
        /// <summary>
        /// Danh sách các lượt đặt phòng liên quan đến phòng này.
        /// </summary>
        public virtual ICollection<Booking>? Bookings { get; set; }
        
        /// <summary>
        /// Danh sách khách hàng đã đánh dấu phòng này là yêu thích.
        /// </summary>
        public virtual ICollection<FavoriteRoom>? FavoriteRooms { get; set; }
    }
} 