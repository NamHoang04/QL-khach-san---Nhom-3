using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models
{
    public class FavoriteRoom
    {
        [Column("customer_id", Order = 0)]
        public int CustomerId { get; set; }
        [Column("room_id", Order = 1)]
        public int RoomId { get; set; }

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }
        [ForeignKey("RoomId")]
        public virtual Room? Room { get; set; }
    }
}