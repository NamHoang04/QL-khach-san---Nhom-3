using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    /// <summary>
    /// Đại diện cho mối quan hệ nhiều-nhiều giữa Admin và Role.
    /// </summary>
    public class AdminRole
    {
        /// <summary>
        /// Khóa chính kép: ID của Admin.
        /// </summary>
        [Key]
        [Column("admin_id", Order = 0)]
        public int AdminId { get; set; }
        
        /// <summary>
        /// Khóa chính kép: ID của Role.
        /// </summary>
        [Key]
        [Column("role_id", Order = 1)]
        public int RoleId { get; set; }
        
        // Navigation properties
        /// <summary>
        /// Thông tin Admin tương ứng.
        /// </summary>
        [ForeignKey("AdminId")]
        public virtual Admin? Admin { get; set; }
        
        /// <summary>
        /// Thông tin Role tương ứng.
        /// </summary>
        [ForeignKey("RoleId")]
        public virtual Role? Role { get; set; }
    }
} 