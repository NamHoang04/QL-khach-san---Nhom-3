using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class Service
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [Column("price", TypeName = "decimal(15,2)")]
        public decimal Price { get; set; }

        [Column("child_price", TypeName = "decimal(15,2)")]
        public decimal? ChildPrice { get; set; } // Giá cho trẻ em
        
        [Column("description")]
        public string? Description { get; set; }

        [Column("unit_type")]
        [StringLength(50)]
        public string? UnitType { get; set; } // "người", "kg", v.v.
    }
} 