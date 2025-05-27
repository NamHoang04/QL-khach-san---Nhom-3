using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    /// <summary>
    /// Đại diện cho quyền (Permission) trong hệ thống.
    /// </summary>
    public class Permission
    {
        /// <summary>
        /// Khóa chính tự tăng của quyền.
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        /// <summary>
        /// Tên của quyền (ví dụ: ViewRooms, EditBookings).
        /// </summary>
        [Required]
        [StringLength(50)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;
        
        /// <summary>
        /// Mô tả chi tiết về quyền (có thể null).
        /// </summary>
        [StringLength(255)]
        [Column("description")]
        public string? Description { get; set; }
        
        // Navigation properties
        /// <summary>
        /// Danh sách các vai trò có quyền này.
        /// </summary>
        public virtual ICollection<RolePermission>? RolePermissions { get; set; }
    }
} 