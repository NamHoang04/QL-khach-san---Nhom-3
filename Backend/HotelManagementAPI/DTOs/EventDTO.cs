using System;

namespace HotelManagementAPI.DTOs
{
    public class EventDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Location { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public DateTime? EventDate { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class CreateEventDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Location { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public DateTime? EventDate { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class UpdateEventDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Location { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public DateTime? EventDate { get; set; }
        public string? ImageUrl { get; set; }
    }
} 