using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class Booking
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Required]
        [StringLength(10)]
        [Column("booking_code")]
        public string BookingCode { get; set; } = string.Empty;
        
        [Required]
        [Column("customer_id")]
        public int CustomerId { get; set; }
        
        [Required]
        [Column("room_id")]
        public int RoomId { get; set; }
        
        [Required]
        [Column("check_in", TypeName = "date")]
        public DateTime CheckIn { get; set; }
        
        [Required]
        [Column("check_out", TypeName = "date")]
        public DateTime CheckOut { get; set; }
        
        [StringLength(50)]
        [Column("status")]
        public string? Status { get; set; } // Đã xác nhận, Chờ xác nhận, Đã hủy
        
        // Navigation properties
        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }
        
        [ForeignKey("RoomId")]
        public virtual Room? Room { get; set; }
        
        public virtual ICollection<Invoice>? Invoices { get; set; }
    }
} 