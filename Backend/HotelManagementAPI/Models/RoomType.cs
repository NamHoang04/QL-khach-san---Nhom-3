using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    /// <summary>
    /// Đại diện cho loại phòng trong hệ thống khách sạn.
    /// </summary>
    public class RoomType
    {
        /// <summary>
        /// Khóa chính tự tăng của loại phòng.
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        /// <summary>
        /// Tên loại phòng (ví dụ: Standard, Deluxe, Suite).
        /// </summary>
        [Required]
        [StringLength(100)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;
        
        /// <summary>
        /// Giá cơ bản của loại phòng.
        /// </summary>
        [Required]
        [Column("price", TypeName = "decimal(15,2)")]
        public decimal Price { get; set; }
        
        /// <summary>
        /// Mô tả chi tiết về loại phòng.
        /// </summary>
        [Column("description")]
        public string? Description { get; set; }
        
        /// <summary>
        /// Diện tích của loại phòng (đơn vị m2, có thể null).
        /// </summary>
        [Column("area")]
        public int? Area { get; set; }
        
        /// <summary>
        /// Số lượng khách tối đa mà loại phòng này có thể chứa (có thể null).
        /// </summary>
        [Column("max_guests")]
        public int? MaxGuests { get; set; }
        
        /// <summary>
        /// Các tiện nghi có trong loại phòng (chuỗi, có thể null).
        /// </summary>
        [Column("amenities")]
        public string? Amenities { get; set; }
        
        /// <summary>
        /// URL hình ảnh đại diện cho loại phòng (có thể null).
        /// </summary>
        [StringLength(255)]
        [Column("image_url")]
        public string? ImageUrl { get; set; }
        
        // Navigation properties
        /// <summary>
        /// Danh sách các phòng thuộc loại phòng này.
        /// </summary>
        public virtual ICollection<Room>? Rooms { get; set; }
    }
} 