using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class BookingService
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("booking_id")]
        public int BookingId { get; set; }

        [Column("service_id")]
        public int ServiceId { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        [Column("price", TypeName = "decimal(15,2)")]
        public decimal Price { get; set; }

        [Column("note")]
        public string? Note { get; set; }

        [ForeignKey("BookingId")]
        public virtual Booking? Booking { get; set; }
        [ForeignKey("ServiceId")]
        public virtual Service? Service { get; set; }
    }
} 