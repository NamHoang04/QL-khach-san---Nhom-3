using System.Threading.Tasks;
using HotelManagementAPI.Common;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace HotelManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Đăng nhập vào hệ thống
        /// </summary>
        [HttpPost("login")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponseDTO>), 200)]
        [ProducesResponseType(typeof(ApiResponse<AuthResponseDTO>), 401)]
        public async Task<ActionResult<ApiResponse<AuthResponseDTO>>> Login(LoginDTO loginDto)
        {
            _logger.LogInformation("Đang xử lý yêu cầu đăng nhập cho người dùng: {Username}", loginDto.UserName);
            
            var authResult = await _authService.Login(loginDto);
            
            if (!authResult.Success)
            {
                _logger.LogWarning("Đăng nhập thất bại cho người dùng: {Username}", loginDto.UserName);
                return Unauthorized(ApiResponse<AuthResponseDTO>.Unauthorized(Constants.Messages.LoginFailed));
            }
            
            _logger.LogInformation("Đăng nhập thành công cho người dùng: {Username}", loginDto.UserName);
            return Ok(ApiResponse<AuthResponseDTO>.Ok(authResult, Constants.Messages.LoginSuccess));
        }

        /// <summary>
        /// Đăng ký tài khoản mới
        /// </summary>
        [HttpPost("register")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponseDTO>), 200)]
        [ProducesResponseType(typeof(ApiResponse<AuthResponseDTO>), 400)]
        public async Task<ActionResult<ApiResponse<AuthResponseDTO>>> Register(RegisterDTO registerDto)
        {
            _logger.LogInformation("Đang xử lý yêu cầu đăng ký cho tài khoản: {Username}", registerDto.Username);
            
            var authResult = await _authService.Register(registerDto);
            
            if (!authResult.Success)
            {
                _logger.LogWarning("Đăng ký thất bại cho tài khoản: {Username}, Lỗi: {Error}", 
                    registerDto.Username, authResult.Message);
                return BadRequest(ApiResponse<AuthResponseDTO>.Error(authResult.Message));
            }
            
            _logger.LogInformation("Đăng ký thành công cho tài khoản: {Username}", registerDto.Username);
            return Ok(ApiResponse<AuthResponseDTO>.Ok(authResult, Constants.Messages.RegisterSuccess));
        }
    }
} 