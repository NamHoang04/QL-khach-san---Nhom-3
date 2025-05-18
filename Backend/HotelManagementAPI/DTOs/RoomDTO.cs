namespace HotelManagementAPI.DTOs
{
    public class RoomDTO
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public int RoomTypeId { get; set; }
        public int? Floor { get; set; }
        public decimal Price { get; set; }
        public string? Status { get; set; }
        public string? RoomTypeName { get; set; }
    }

    public class CreateRoomDTO
    {
        public string RoomNumber { get; set; } = string.Empty;
        public int RoomTypeId { get; set; }
        public int? Floor { get; set; }
        public decimal Price { get; set; }
        public string? Status { get; set; }
    }

    public class UpdateRoomDTO
    {
        public string RoomNumber { get; set; } = string.Empty;
        public int RoomTypeId { get; set; }
        public int? Floor { get; set; }
        public decimal Price { get; set; }
        public string? Status { get; set; }
    }
} 