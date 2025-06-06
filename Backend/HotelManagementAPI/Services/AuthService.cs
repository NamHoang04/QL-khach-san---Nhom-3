using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using System.Security.Cryptography;
using HotelManagementAPI.Common;

namespace HotelManagementAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> Login(LoginDTO loginDto);
        Task<AuthResponseDTO> Register(RegisterDTO registerDto);
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDTO> Login(LoginDTO loginDto)
        {
            // Tìm kiếm Admin
            var Admin = await _context.Admins.FirstOrDefaultAsync(a => a.Username == loginDto.UserName);
            if (Admin != null && VerifyPassword(loginDto.Password, Admin.Password))
            {
                var token = GenerateJwtToken(Admin.Id.ToString(), Admin.Username, Constants.Roles.Admin);
                
                return new AuthResponseDTO
                {
                    Success = true,
                    Message = Constants.Messages.LoginSuccess,
                    Token = token
                };
            }
            
            // Tìm kiếm Staff
            var Staff = await _context.Staffs.FirstOrDefaultAsync(s => s.UserName == loginDto.UserName);
            if (Staff != null && VerifyPassword(loginDto.Password, Staff.Password))
            {
                var token = GenerateJwtToken(Staff.Id.ToString(), Staff.UserName, Constants.Roles.Staff);
                
                return new AuthResponseDTO
                {
                    Success = true,
                    Message = Constants.Messages.LoginSuccess,
                    Token = token
                };
            }
            
            // Tìm kiếm khách hàng
            var Customer = await _context.Customers.FirstOrDefaultAsync(c => 
                c.UserName == loginDto.UserName || 
                (c.Email != null && c.Email == loginDto.UserName));
                
            if (Customer != null && VerifyPassword(loginDto.Password, Customer.Password))
            {
                var token = GenerateJwtToken(Customer.Id.ToString(), Customer.UserName, Constants.Roles.Customer);

                return new AuthResponseDTO
                {
                    Success = true,
                    Message = Constants.Messages.LoginSuccess,
                    Token = token,
                    User = new CustomerDTO
                    {
                        Id = Customer.Id,
                        CustomerCode = Customer.CustomerCode,
                        UserName = Customer.UserName,
                        Email = Customer.Email,
                        Phone = Customer.Phone,
                        IdentityNumber = Customer.IdentityNumber,
                        Address = Customer.Address
                    }
                };
            }
            
            return new AuthResponseDTO
            {
                Success = false,
                Message = Constants.Messages.LoginFailed
            };
        }

        public async Task<AuthResponseDTO> Register(RegisterDTO registerDto)
        {
            // Kiểm tra mật khẩu khớp nhau
            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                return new AuthResponseDTO 
                { 
                    Success = false, 
                    Message = Constants.Messages.PasswordMismatch
                };
            }
            
            // Kiểm tra email đã tồn tại
            var emailExists = await _context.Customers.AnyAsync(c => c.Email == registerDto.Email);
            if (emailExists)
            {
                return new AuthResponseDTO 
                { 
                    Success = false, 
                    Message = Constants.Messages.EmailExists
                };
            }
            
            // Kiểm tra CCCD/CMND đã tồn tại
            var identityExists = await _context.Customers.AnyAsync(c => c.IdentityNumber == registerDto.IdentityNumber);
            if (identityExists)
            {
                return new AuthResponseDTO 
                { 
                    Success = false, 
                    Message = Constants.Messages.IdentityExists
                };
            }
            
            // Tạo mã khách hàng
            string CustomerCode = GenerateCustomerCode();
            
            // Mã hóa mật khẩu
            string hashedPassword = HashPassword(registerDto.Password);
            
            // Tạo khách hàng mới
            var Customer = new Customer
            {
                CustomerCode = CustomerCode,
                UserName = registerDto.Username,
                Email = registerDto.Email,
                Phone = registerDto.Phone,
                IdentityNumber = registerDto.IdentityNumber,
                Address = registerDto.Address,
                Password = hashedPassword
            };
            
            _context.Customers.Add(Customer);
            await _context.SaveChangesAsync();
            
            var token = GenerateJwtToken(Customer.Id.ToString(), Customer.UserName, Constants.Roles.Customer);
            
            return new AuthResponseDTO
            {
                Success = true,
                Message = Constants.Messages.RegisterSuccess,
                Token = token,
                User = new CustomerDTO
                {
                    Id = Customer.Id,
                    CustomerCode = Customer.CustomerCode,
                    UserName = Customer.UserName,
                    Email = Customer.Email,
                    Phone = Customer.Phone,
                    IdentityNumber = Customer.IdentityNumber,
                    Address = Customer.Address
                }
            };
        }
        
        private string GenerateJwtToken(string userId, string username, string role)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Name, username),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["JwtSettings:Key"] ?? "DefaultSecretKeyForDevelopment12345678901234"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var tokenExpiration = DateTime.Now.AddDays(
                int.TryParse(_configuration["JwtSettings:DurationInDays"], out int days) ? days : 1);
            
            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"] ?? "HotelAPI",
                audience: _configuration["JwtSettings:Audience"] ?? "HotelClient",
                claims: claims,
                expires: tokenExpiration,
                signingCredentials: creds
            );
            
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        
        private string GenerateCustomerCode()
        {
            var random = new Random();
            string code;
            bool codeExists;
            
            do
            {
                code = "C" + random.Next(10000, 99999).ToString();
                codeExists = _context.Customers.Any(c => c.CustomerCode == code);
            } while (codeExists);
            
            return code;
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
        
        private bool VerifyPassword(string password, string hashedPassword)
        {
            // Hiện tại, DB có thể đang lưu mật khẩu dạng văn bản thuần
            if (password == hashedPassword) return true;
            
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            var computedHash = Convert.ToBase64String(hash);
            
            return computedHash == hashedPassword;
        }
    }
} 