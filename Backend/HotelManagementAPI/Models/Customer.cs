using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    /// <summary>
    /// Đại diện cho thông tin khách hàng trong hệ thống.
    /// </summary>
    public class Customer
    {
        /// <summary>
        /// Khóa chính tự tăng của khách hàng.
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        /// <summary>
        /// Mã khách hàng duy nhất.
        /// </summary>
        [Required]
        [StringLength(10)]
        [Column("Customer_code")]
        public string CustomerCode { get; set; } = string.Empty;

                /// <summary>
        /// Họ và tên đầy đủ của khách hàng.
        /// </summary>
        [Required]
        [StringLength(100)]
        [Column("fullname")]
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Họ và tên đầy đủ của khách hàng.
        /// </summary>
        [Required]
        [StringLength(100)]
        [Column("UserName")]
        public string UserName { get; set; } = string.Empty;
        
        /// <summary>
        /// Địa chỉ email của khách hàng (có thể null).
        /// </summary>
        [StringLength(100)]
        [Column("email")]
        public string? Email { get; set; }
        
        /// <summary>
        /// Số điện thoại của khách hàng (có thể null).
        /// </summary>
        [StringLength(20)]
        [Column("phone")]
        public string? Phone { get; set; }
        
        /// <summary>
        /// Số CMND/CCCD của khách hàng (có thể null).
        /// </summary>
        [StringLength(20)]
        [Column("identity_number")]
        public string? IdentityNumber { get; set; } // CCCD/CMND
        
        /// <summary>
        /// Địa chỉ đầy đủ của khách hàng (có thể null).
        /// </summary>
        [StringLength(200)]
        [Column("address")]
        public string? Address { get; set; }
        
        /// <summary>
        /// Mật khẩu đăng nhập của khách hàng (đã hash).
        /// </summary>
        [Required]
        [StringLength(255)]
        [Column("password")]
        public string Password { get; set; } = string.Empty;
        
        // Navigation properties
        /// <summary>
        /// Danh sách các lượt đặt phòng của khách hàng này.
        /// </summary>
        public virtual ICollection<Booking>? Bookings { get; set; }
        
        /// <summary>
        /// Danh sách các hóa đơn của khách hàng này.
        /// </summary>
        public virtual ICollection<Invoice>? Invoices { get; set; }

        /// <summary>
        /// Danh sách các phòng mà khách hàng này đã đánh dấu yêu thích.
        /// </summary>
        public virtual ICollection<FavoriteRoom>? FavoriteRooms { get; set; }

        /// <summary>
        /// Danh sách các dịch vụ mà khách hàng này đã đánh dấu yêu thích.
        /// </summary>
        public virtual ICollection<FavoriteService>? FavoriteServices { get; set; }
    }
} 