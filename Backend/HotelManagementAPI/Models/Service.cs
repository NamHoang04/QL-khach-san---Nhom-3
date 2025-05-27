using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    /// <summary>
    /// Đại diện cho các dịch vụ khách sạn cung cấp.
    /// </summary>
    public class Service
    {
        /// <summary>
        /// Khóa chính tự tăng của dịch vụ.
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        /// <summary>
        /// Tên của dịch vụ (ví dụ: Giặt ủi, Spa).
        /// </summary>
        [Required]
        [StringLength(100)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;
        
        /// <summary>
        /// Giá của dịch vụ.
        /// </summary>
        [Required]
        [Column("price", TypeName = "decimal(15,2)")]
        public decimal Price { get; set; }
        
        /// <summary>
        /// Mô tả chi tiết về dịch vụ.
        /// </summary>
        [Column("description")]
        public string? Description { get; set; }

        /// <summary>
        /// Icon đại diện cho dịch vụ (có thể là đường dẫn hoặc tên class icon).
        /// </summary>
        [Column("icon")]
        public string? Icon { get; set; }

        /// <summary>
        /// Loại của dịch vụ (ví dụ: Ẩm thực, Đưa đón, Thể thao).
        /// </summary>
        [Column("category")]
        public string? Category { get; set; }

        // Navigation property
        /// <summary>
        /// Danh sách các khách hàng đã đánh dấu dịch vụ này là yêu thích.
        /// </summary>
        public virtual ICollection<FavoriteService>? FavoriteServices { get; set; }
    }
} 