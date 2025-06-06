using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace HotelManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminsController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Admins
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminDTO>>> GetAdmins()
        {
            var Admins = await _context.Admins
                .Include(a => a.AdminRoles)
                .ThenInclude(ar => ar.Role)
                .ToListAsync();

            return Admins.Select(a => new AdminDTO
            {
                Id = a.Id,
                Username = a.Username,
                Email = a.Email,
                Role = a.Role,
                Roles = a.AdminRoles == null ? new List<string>() : a.AdminRoles.Where(ar => ar?.Role?.Name != null).Select(ar => ar!.Role!.Name!).ToList()
            }).ToList();
        }

        // GET: api/Admins/5
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminDTO>> GetAdmin(int id)
        {
            var Admin = await _context.Admins
                .Include(a => a.AdminRoles)
                .ThenInclude(ar => ar.Role)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (Admin == null)
            {
                return NotFound();
            }

            return new AdminDTO
            {
                Id = Admin.Id,
                Username = Admin.Username,
                Email = Admin.Email,
                Role = Admin.Role,
                Roles = Admin.AdminRoles == null ? new List<string>() : Admin.AdminRoles.Where(ar => ar?.Role?.Name != null).Select(ar => ar!.Role!.Name!).ToList()
            };
        }

        // POST: api/Admins
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<AdminDTO>> CreateAdmin(CreateAdminDTO createAdminDTO)
        {
            // Kiểm tra xem username đã tồn tại chưa
            var existingAdmin = await _context.Admins
                .FirstOrDefaultAsync(a => a.Username == createAdminDTO.Username);
            
            if (existingAdmin != null)
            {
                return BadRequest("Username already exists");
            }

            // Mã hóa mật khẩu
            string hashedPassword = HashPassword(createAdminDTO.Password);

            var Admin = new Admin
            {
                Username = createAdminDTO.Username,
                Password = hashedPassword,
                Email = createAdminDTO.Email,
                Role = createAdminDTO.Role ?? "Admin"
            };

            _context.Admins.Add(Admin);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAdmin), new { id = Admin.Id }, new AdminDTO
            {
                Id = Admin.Id,
                Username = Admin.Username,
                Email = Admin.Email,
                Role = Admin.Role
            });
        }

        // PUT: api/Admins/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAdmin(int id, UpdateAdminDTO updateAdminDTO)
        {
            var Admin = await _context.Admins.FindAsync(id);
            if (Admin == null)
            {
                return NotFound();
            }

            Admin.Email = updateAdminDTO.Email ?? Admin.Email;
            Admin.Role = updateAdminDTO.Role ?? Admin.Role;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdminExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Admins/5/change-password
        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(int id, ChangePasswordDTO changePasswordDTO)
        {
            var Admin = await _context.Admins.FindAsync(id);
            if (Admin == null)
            {
                return NotFound();
            }

            // Kiểm tra mật khẩu cũ
            if (!VerifyPassword(changePasswordDTO.OldPassword, Admin.Password))
            {
                return BadRequest("Invalid old password");
            }

            // Mã hóa mật khẩu mới
            string hashedPassword = HashPassword(changePasswordDTO.NewPassword);
            Admin.Password = hashedPassword;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Admins/5/assign-roles
        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/assign-roles")]
        public async Task<IActionResult> AssignRoles(int id, AssignRoleDTO assignRoleDTO)
        {
            var Admin = await _context.Admins.FindAsync(id);
            if (Admin == null)
            {
                return NotFound("Admin not found");
            }

            // Kiểm tra các vai trò hợp lệ
            var roles = await _context.Roles
                .Where(r => assignRoleDTO.RoleIds.Contains(r.Id))
                .ToListAsync();

            if (roles.Count != assignRoleDTO.RoleIds.Count)
            {
                return BadRequest("One or more invalid role IDs");
            }

            // Xóa các vai trò hiện tại
            var currentRoles = await _context.AdminRoles
                .Where(ar => ar.AdminId == id)
                .ToListAsync();

            _context.AdminRoles.RemoveRange(currentRoles);

            // Thêm vai trò mới
            foreach (var roleId in assignRoleDTO.RoleIds)
            {
                _context.AdminRoles.Add(new AdminRole
                {
                    AdminId = id,
                    RoleId = roleId
                });
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Admins/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            var Admin = await _context.Admins.FindAsync(id);
            if (Admin == null)
            {
                return NotFound();
            }

            _context.Admins.Remove(Admin);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Admins/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            var Admin = await _context.Admins.FirstOrDefaultAsync(a => a.Username == loginDto.UserName);
            if (Admin == null || Admin.Password != loginDto.Password) // Nên hash và so sánh hash thực tế
            {
                return Unauthorized("Sai tài khoản hoặc mật khẩu");
            }

            var token = GenerateJwtToken(Admin.Id, Admin.Username, "Admin");
            return Ok(new { token });
        }

        private string GenerateJwtToken(int id, string username, string role)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"] ?? "DefaultSecretKeyForDevelopment12345678901234"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool AdminExists(int id)
        {
            return _context.Admins.Any(e => e.Id == id);
        }

        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        private bool VerifyPassword(string enteredPassword, string storedHash)
        {
            string hashedEnteredPassword = HashPassword(enteredPassword);
            return string.Equals(hashedEnteredPassword, storedHash);
        }
    }
}