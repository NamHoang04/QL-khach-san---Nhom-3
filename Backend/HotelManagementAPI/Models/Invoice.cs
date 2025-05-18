using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class Invoice
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Required]
        [StringLength(15)]
        [Column("invoice_code")]
        public string InvoiceCode { get; set; } = string.Empty;
        
        [Required]
        [Column("customer_id")]
        public int CustomerId { get; set; }
        
        [Column("booking_id")]
        public int? BookingId { get; set; }
        
        [Required]
        [Column("created_at", TypeName = "date")]
        public DateTime CreatedAt { get; set; }
        
        [Required]
        [Column("total_amount", TypeName = "decimal(15,2)")]
        public decimal TotalAmount { get; set; }
        
        [StringLength(50)]
        [Column("status")]
        public string? Status { get; set; } // Đã thanh toán, Chờ thanh toán
        
        [StringLength(50)]
        [Column("payment_method")]
        public string? PaymentMethod { get; set; }
        
        [StringLength(50)]
        [Column("notes")]
        public string? Notes { get; set; }
        
        // Navigation properties
        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }
        
        [ForeignKey("BookingId")]
        public virtual Booking? Booking { get; set; }
    }
} 