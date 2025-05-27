using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class Staff
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Required]
        [StringLength(10)]
        [Column("staff_code")]
        public string StaffCode { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        [Column("full_name")]
        public string FullName { get; set; } = string.Empty;
        
        [StringLength(100)]
        [Column("email")]
        public string? Email { get; set; }
        
        [StringLength(20)]
        [Column("phone")]
        public string? Phone { get; set; }
        
        [StringLength(50)]
        [Column("position")]
        public string? Position { get; set; }
        
        [StringLength(50)]
        [Column("status")]
        public string? Status { get; set; } // Đang làm việc, Tạm nghỉ, Khóa
        
        [StringLength(255)]
        [Column("avatar_url")]
        public string? AvatarUrl { get; set; }

        [StringLength(255)]
        [Column("password")]
        public string Password { get; set; } = string.Empty;
    }
}