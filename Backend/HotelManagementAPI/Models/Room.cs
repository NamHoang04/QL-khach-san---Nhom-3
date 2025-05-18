using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class Room
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Required]
        [StringLength(10)]
        [Column("room_number")]
        public string RoomNumber { get; set; } = string.Empty;
        
        [Required]
        [Column("room_type_id")]
        public int RoomTypeId { get; set; }
        
        [Column("floor")]
        public int? Floor { get; set; }
        
        [Required]
        [Column("price", TypeName = "decimal(15,2)")]
        public decimal Price { get; set; }
        
        [StringLength(50)]
        [Column("status")]
        public string? Status { get; set; } // Sẵn sàng, Đang sử dụng, Bảo trì
        
        // Navigation properties
        [ForeignKey("RoomTypeId")]
        public virtual RoomType? RoomType { get; set; }
        
        public virtual ICollection<Booking>? Bookings { get; set; }
    }
} 