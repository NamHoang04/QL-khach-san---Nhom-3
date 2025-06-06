using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    /// <summary>
    /// Đại diện cho thông tin đặt phòng của khách hàng.
    /// </summary>
    public class Booking
    {
        /// <summary>
        /// Khóa chính tự tăng của đặt phòng.
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        /// <summary>
        /// Mã đặt phòng duy nhất.
        /// </summary>
        [Required]
        [StringLength(50)]
        [Column("booking_code")]
        public string BookingCode { get; set; } = string.Empty;
        
        /// <summary>
        /// ID của khách hàng đặt phòng (liên kết với bảng Customer).
        /// </summary>
        [Required]
        [Column("Customer_id")]
        public int CustomerId { get; set; }
        
        /// <summary>
        /// ID của phòng được đặt (liên kết với bảng Room).
        /// </summary>
        [Required]
        [Column("room_id")]
        public int RoomId { get; set; }
        
        /// <summary>
        /// Ngày nhận phòng.
        /// </summary>
        [Required]
        [Column("check_in")]
        public DateTime CheckIn { get; set; }
        
        /// <summary>
        /// Ngày trả phòng.
        /// </summary>
        [Required]
        [Column("check_out")]
        public DateTime CheckOut { get; set; }
        
        /// <summary>
        /// Trạng thái của đặt phòng (ví dụ: Chờ xác nhận, Đã xác nhận, Đang sử dụng, Hoàn thành, Đã huỷ).
        /// </summary>
        [StringLength(50)]
        [Column("status")]
        public string? Status { get; set; } // Đã xác nhận, Chờ xác nhận, Đã hủy
        
        // Navigation properties
        /// <summary>
        /// Thông tin khách hàng đặt phòng.
        /// </summary>
        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }
        
        /// <summary>
        /// Thông tin phòng được đặt.
        /// </summary>
        [ForeignKey("RoomId")]
        public virtual Room? Room { get; set; }
        
        /// <summary>
        /// Danh sách các hóa đơn liên quan đến đặt phòng này.
        /// </summary>
        public virtual ICollection<Invoice>? Invoices { get; set; }

        /// <summary>
        /// Danh sách các dịch vụ đã được đặt thêm cho đặt phòng này.
        /// </summary>
        public virtual ICollection<BookingService>? BookingServices { get; set; }
    }
} 