using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class AdminRole
    {
        [Key]
        [Column("admin_id", Order = 0)]
        public int AdminId { get; set; }
        
        [Key]
        [Column("role_id", Order = 1)]
        public int RoleId { get; set; }
        
        // Navigation properties
        [ForeignKey("AdminId")]
        public virtual Admin? Admin { get; set; }
        
        [ForeignKey("RoleId")]
        public virtual Role? Role { get; set; }
    }
} 