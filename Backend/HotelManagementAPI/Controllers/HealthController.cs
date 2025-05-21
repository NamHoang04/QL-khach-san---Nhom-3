using Microsoft.AspNetCore.Mvc;

namespace HotelManagementAPI.Controllers
{
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        [Route("api/[controller]")]
        [Route("[controller]")]
        public IActionResult Get()
        {
            return Ok(new { status = "healthy", message = "API is running" });
        }
    }
}