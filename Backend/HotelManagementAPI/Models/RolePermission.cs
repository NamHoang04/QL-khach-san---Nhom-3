using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class RolePermission
    {
        [Key]
        [Column("role_id", Order = 0)]
        public int RoleId { get; set; }
        
        [Key]
        [Column("permission_id", Order = 1)]
        public int PermissionId { get; set; }
        
        // Navigation properties
        [ForeignKey("RoleId")]
        public virtual Role? Role { get; set; }
        
        [ForeignKey("PermissionId")]
        public virtual Permission? Permission { get; set; }
    }
} 