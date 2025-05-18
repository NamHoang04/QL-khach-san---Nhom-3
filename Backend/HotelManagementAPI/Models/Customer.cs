using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class Customer
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Required]
        [StringLength(10)]
        [Column("customer_code")]
        public string CustomerCode { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        [Column("full_name")]
        public string FullName { get; set; } = string.Empty;
        
        [StringLength(100)]
        [Column("email")]
        public string? Email { get; set; }
        
        [StringLength(20)]
        [Column("phone")]
        public string? Phone { get; set; }
        
        [StringLength(20)]
        [Column("identity_number")]
        public string? IdentityNumber { get; set; } // CCCD/CMND
        
        [StringLength(200)]
        [Column("address")]
        public string? Address { get; set; }
        
        [Required]
        [StringLength(255)]
        [Column("password")]
        public string Password { get; set; } = string.Empty;
        
        // Navigation properties
        public virtual ICollection<Booking>? Bookings { get; set; }
        public virtual ICollection<Invoice>? Invoices { get; set; }
    }
} 