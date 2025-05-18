using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
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

        public AdminsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Admins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminDTO>>> GetAdmins()
        {
            var admins = await _context.Admins
                .Include(a => a.AdminRoles)
                .ThenInclude(ar => ar.Role)
                .ToListAsync();

            return admins.Select(a => new AdminDTO
            {
                Id = a.Id,
                Username = a.Username,
                Email = a.Email,
                Role = a.Role,
                Roles = a.AdminRoles?.Select(ar => ar.Role?.Name).Where(n => n != null).ToList()
            }).ToList();
        }

        // GET: api/Admins/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminDTO>> GetAdmin(int id)
        {
            var admin = await _context.Admins
                .Include(a => a.AdminRoles)
                .ThenInclude(ar => ar.Role)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (admin == null)
            {
                return NotFound();
            }

            return new AdminDTO
            {
                Id = admin.Id,
                Username = admin.Username,
                Email = admin.Email,
                Role = admin.Role,
                Roles = admin.AdminRoles?.Select(ar => ar.Role?.Name).Where(n => n != null).ToList()
            };
        }

        // POST: api/Admins
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

            var admin = new Admin
            {
                Username = createAdminDTO.Username,
                Password = hashedPassword,
                Email = createAdminDTO.Email,
                Role = createAdminDTO.Role ?? "admin"
            };

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAdmin), new { id = admin.Id }, new AdminDTO
            {
                Id = admin.Id,
                Username = admin.Username,
                Email = admin.Email,
                Role = admin.Role
            });
        }

        // PUT: api/Admins/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAdmin(int id, UpdateAdminDTO updateAdminDTO)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
            {
                return NotFound();
            }

            admin.Email = updateAdminDTO.Email ?? admin.Email;
            admin.Role = updateAdminDTO.Role ?? admin.Role;

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
        [HttpPost("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(int id, ChangePasswordDTO changePasswordDTO)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
            {
                return NotFound();
            }

            // Kiểm tra mật khẩu cũ
            if (!VerifyPassword(changePasswordDTO.OldPassword, admin.Password))
            {
                return BadRequest("Invalid old password");
            }

            // Mã hóa mật khẩu mới
            string hashedPassword = HashPassword(changePasswordDTO.NewPassword);
            admin.Password = hashedPassword;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Admins/5/assign-roles
        [HttpPost("{id}/assign-roles")]
        public async Task<IActionResult> AssignRoles(int id, AssignRoleDTO assignRoleDTO)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
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
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
            {
                return NotFound();
            }

            _context.Admins.Remove(admin);
            await _context.SaveChangesAsync();

            return NoContent();
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