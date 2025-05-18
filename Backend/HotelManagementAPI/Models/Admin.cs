using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class Admin
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        [Column("username")]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [StringLength(255)]
        [Column("password")]
        public string Password { get; set; } = string.Empty;
        
        [StringLength(100)]
        [Column("email")]
        public string? Email { get; set; }
        
        [StringLength(20)]
        [Column("role")]
        public string Role { get; set; } = "admin";
        
        // Navigation properties
        public virtual ICollection<AdminRole>? AdminRoles { get; set; }
    }
} 