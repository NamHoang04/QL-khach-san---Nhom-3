using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class FavoriteService
    {
        [Column("customer_id", Order = 0)]
        public int CustomerId { get; set; }
        [Column("service_id", Order = 1)]
        public int ServiceId { get; set; }

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }
        [ForeignKey("ServiceId")]
        public virtual Service? Service { get; set; }
    }
}