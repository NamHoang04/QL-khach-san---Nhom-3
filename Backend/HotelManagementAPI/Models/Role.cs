using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class Role
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(255)]
        [Column("description")]
        public string? Description { get; set; }
        
        // Navigation properties
        public virtual ICollection<AdminRole>? AdminRoles { get; set; }
        public virtual ICollection<RolePermission>? RolePermissions { get; set; }
    }
} 