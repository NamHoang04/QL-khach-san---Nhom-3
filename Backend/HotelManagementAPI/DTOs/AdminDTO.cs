using System.Collections.Generic;

namespace HotelManagementAPI.DTOs
{
    public class AdminDTO
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Role { get; set; } = string.Empty;
        public List<string>? Roles { get; set; }
    }

    public class CreateAdminDTO
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Role { get; set; }
    }

    public class UpdateAdminDTO
    {
        public string? Email { get; set; }
        public string? Role { get; set; }
    }

    public class ChangePasswordDTO
    {
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class RoleDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<string>? Permissions { get; set; }
    }

    public class CreateRoleDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<int>? PermissionIds { get; set; }
    }

    public class UpdateRoleDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<int>? PermissionIds { get; set; }
    }

    public class PermissionDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class CreatePermissionDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class UpdatePermissionDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class AssignRoleDTO
    {
        public int AdminId { get; set; }
        public List<int> RoleIds { get; set; } = new List<int>();
    }
} 