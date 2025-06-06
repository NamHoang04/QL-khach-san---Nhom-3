using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    /// <summary>
    /// Đại diện cho thông tin hóa đơn trong hệ thống.
    /// </summary>
    public class Invoice
    {
        /// <summary>
        /// Khóa chính tự tăng của hóa đơn.
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        /// <summary>
        /// Mã hóa đơn duy nhất.
        /// </summary>
        [Required]
        [StringLength(15)]
        [Column("invoice_code")]
        public string InvoiceCode { get; set; } = string.Empty;
        
        /// <summary>
        /// ID của khách hàng liên quan đến hóa đơn (liên kết với bảng Customer).
        /// </summary>
        [Required]
        [Column("Customer_id")]
        public int CustomerId { get; set; }
        
        /// <summary>
        /// ID của đặt phòng liên quan đến hóa đơn (có thể null).
        /// </summary>
        [Column("booking_id")]
        public int? BookingId { get; set; }
        
        /// <summary>
        /// Thời gian tạo hóa đơn.
        /// </summary>
        [Required]
        [Column("created_at", TypeName = "date")]
        public DateTime CreatedAt { get; set; }
        
        /// <summary>
        /// Tổng số tiền của hóa đơn.
        /// </summary>
        [Required]
        [Column("total_amount", TypeName = "decimal(15,2)")]
        public decimal TotalAmount { get; set; }
        
        /// <summary>
        /// Trạng thái của hóa đơn (ví dụ: Đã thanh toán, Chờ thanh toán).
        /// </summary>
        [StringLength(50)]
        [Column("status")]
        public string? Status { get; set; } // Đã thanh toán, Chờ thanh toán
        
        /// <summary>
        /// Phương thức thanh toán (có thể null).
        /// </summary>
        [StringLength(50)]
        [Column("payment_method")]
        public string? PaymentMethod { get; set; }
        
        /// <summary>
        /// Các ghi chú cho hóa đơn (có thể null).
        /// </summary>
        [StringLength(50)]
        [Column("notes")]
        public string? Notes { get; set; }
        
        // Navigation properties
        /// <summary>
        /// Thông tin khách hàng liên quan.
        /// </summary>
        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }
        
        /// <summary>
        /// Thông tin đặt phòng liên quan (nếu có).
        /// </summary>
        [ForeignKey("BookingId")]
        public virtual Booking? Booking { get; set; }
    }
} 