using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;

namespace HotelManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin,staff")]
    public class StaffController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public StaffController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Staff
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDTO>>> GetStaff()
        {
            var staffList = await _context.Staffs.ToListAsync();

            return staffList.Select(s => new StaffDTO
            {
                Id = s.Id,
                StaffCode = s.StaffCode,
                FullName = s.FullName,
                Email = s.Email,
                Phone = s.Phone,
                Position = s.Position,
                Status = s.Status,
                AvatarUrl = s.AvatarUrl
            }).ToList();
        }

        // GET: api/Staff/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffDTO>> GetStaff(int id)
        {
            var staff = await _context.Staffs.FindAsync(id);

            if (staff == null)
            {
                return NotFound();
            }

            return new StaffDTO
            {
                Id = staff.Id,
                StaffCode = staff.StaffCode,
                FullName = staff.FullName,
                Email = staff.Email,
                Phone = staff.Phone,
                Position = staff.Position,
                Status = staff.Status,
                AvatarUrl = staff.AvatarUrl
            };
        }

        // POST: api/Staff
        [HttpPost]
        public async Task<ActionResult<StaffDTO>> CreateStaff(CreateStaffDTO createStaffDTO)
        {
            // Kiểm tra xem StaffCode đã tồn tại chưa
            var existingStaff = await _context.Staffs
                .FirstOrDefaultAsync(s => s.StaffCode == createStaffDTO.StaffCode);
            
            if (existingStaff != null)
            {
                return BadRequest("Staff code already exists");
            }

            var staff = new Staff
            {
                StaffCode = createStaffDTO.StaffCode,
                FullName = createStaffDTO.FullName,
                Email = createStaffDTO.Email,
                Phone = createStaffDTO.Phone,
                Position = createStaffDTO.Position,
                Status = createStaffDTO.Status ?? "Đang làm việc",
                AvatarUrl = createStaffDTO.AvatarUrl,
                Password = HashPassword(createStaffDTO.Password) // Mã hóa mật khẩu trước khi lưu
            };

            _context.Staffs.Add(staff);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStaff), new { id = staff.Id }, new StaffDTO
            {
                Id = staff.Id,
                StaffCode = staff.StaffCode,
                FullName = staff.FullName,
                Email = staff.Email,
                Phone = staff.Phone,
                Position = staff.Position,
                Status = staff.Status,
                AvatarUrl = staff.AvatarUrl
            });
        }

        // PUT: api/Staff/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStaff(int id, UpdateStaffDTO updateStaffDTO)
        {
            var staff = await _context.Staffs.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }

            staff.FullName = updateStaffDTO.FullName;
            staff.Email = updateStaffDTO.Email;
            staff.Phone = updateStaffDTO.Phone;
            staff.Position = updateStaffDTO.Position;
            staff.Status = updateStaffDTO.Status;
            staff.AvatarUrl = updateStaffDTO.AvatarUrl;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StaffExists(id))
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

        // PATCH: api/Staff/5/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStaffStatus(int id, StaffStatusUpdateDTO statusUpdateDTO)
        {
            var staff = await _context.Staffs.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }

            staff.Status = statusUpdateDTO.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StaffExists(id))
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

        // DELETE: api/Staff/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            var staff = await _context.Staffs.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }

            _context.Staffs.Remove(staff);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Staff/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            var staff = await _context.Staffs.FirstOrDefaultAsync(s => s.StaffCode == loginDto.Username);
            if (staff == null || !VerifyPassword(loginDto.Password, staff.Password))
            {
                return Unauthorized("Sai tài khoản hoặc mật khẩu");
            }

            var token = GenerateJwtToken(staff.Id, staff.StaffCode, "staff");
            return Ok(new { token });
        }

        private string GenerateJwtToken(int id, string staffCode, string role)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                new Claim(ClaimTypes.Name, staffCode),
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

        private bool StaffExists(int id)
        {
            return _context.Staffs.Any(e => e.Id == id);
        }
    }
}