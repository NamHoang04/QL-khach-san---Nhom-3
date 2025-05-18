using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class RoomType
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
        
        [Column("description")]
        public string? Description { get; set; }
        
        [Column("area")]
        public int? Area { get; set; }
        
        [Column("max_guests")]
        public int? MaxGuests { get; set; }
        
        [Column("amenities")]
        public string? Amenities { get; set; }
        
        [StringLength(255)]
        [Column("image_url")]
        public string? ImageUrl { get; set; }
        
        // Navigation properties
        public virtual ICollection<Room>? Rooms { get; set; }
    }
} 