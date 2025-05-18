using System;

namespace HotelManagementAPI.DTOs
{
    public class BookingDTO
    {
        public int Id { get; set; }
        public string BookingCode { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public int RoomId { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public string? Status { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }
        public string? RoomNumber { get; set; }
        public string? RoomTypeName { get; set; }
    }

    public class CreateBookingDTO
    {
        public string BookingCode { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public int RoomId { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public string? Status { get; set; }
    }

    public class UpdateBookingDTO
    {
        public int CustomerId { get; set; }
        public int RoomId { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public string? Status { get; set; }
    }

    public class BookingStatusUpdateDTO
    {
        public string Status { get; set; } = string.Empty;
    }
} 