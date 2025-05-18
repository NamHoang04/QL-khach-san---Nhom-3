namespace HotelManagementAPI.DTOs
{
    public class RoomTypeDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public int? Area { get; set; }
        public int? MaxGuests { get; set; }
        public string? Amenities { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class CreateRoomTypeDTO
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public int? Area { get; set; }
        public int? MaxGuests { get; set; }
        public string? Amenities { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class UpdateRoomTypeDTO
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public int? Area { get; set; }
        public int? MaxGuests { get; set; }
        public string? Amenities { get; set; }
        public string? ImageUrl { get; set; }
    }
} 