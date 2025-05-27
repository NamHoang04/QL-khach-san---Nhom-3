using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    /// <summary>
    /// Đại diện cho tài khoản Admin trong hệ thống.
    /// </summary>
    public class Admin
    {
        /// <summary>
        /// Khóa chính tự tăng của Admin.
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        /// <summary>
        /// Tên đăng nhập của Admin.
        /// </summary>
        [Required]
        [StringLength(50)]
        [Column("username")]
        public string Username { get; set; } = string.Empty;
        
        /// <summary>
        /// Mật khẩu của Admin (đã hash).
        /// </summary>
        [Required]
        [StringLength(255)]
        [Column("password")]
        public string Password { get; set; } = string.Empty;
        
        /// <summary>
        /// Tên đầy đủ của Admin (có thể null).
        /// </summary>
        [StringLength(100)]
        [Column("full_name")]
        public string? FullName { get; set; }
        
        [StringLength(100)]
        [Column("email")]
        public string? Email { get; set; }
        
        [StringLength(20)]
        [Column("role")]
        public string Role { get; set; } = "admin";
        
        // Navigation properties
        /// <summary>
        /// Danh sách các vai trò của Admin này.
        /// </summary>
        public virtual ICollection<AdminRole> AdminRoles { get; set; } = new List<AdminRole>();
    }
}