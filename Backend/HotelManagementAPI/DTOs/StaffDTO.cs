namespace HotelManagementAPI.DTOs
{
    public class StaffDTO
    {
        public int Id { get; set; }
        public string StaffCode { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Position { get; set; }
        public string? Status { get; set; }
        public string? AvatarUrl { get; set; }
        public string Password { get; set; } = string.Empty;
    }

    public class CreateStaffDTO
    {
        public string StaffCode { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Position { get; set; }
        public string? Status { get; set; }
        public string? AvatarUrl { get; set; }
        public string Password { get; set; } = string.Empty;
    }

    public class UpdateStaffDTO
    {
        public string UserName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Position { get; set; }
        public string? Status { get; set; }
        public string? AvatarUrl { get; set; }
    }

    public class StaffStatusUpdateDTO
    {
        public string Status { get; set; } = string.Empty;
    }
}