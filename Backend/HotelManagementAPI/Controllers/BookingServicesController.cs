using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Staff,Customer")]
    public class BookingServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public BookingServicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/BookingServices?bookingId=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingServiceDTO>>> GetBookingServices([FromQuery] int bookingId)
        {
            var items = await _context.BookingServices
                .Where(bs => bs.BookingId == bookingId)
                .Include(bs => bs.Service)
                .ToListAsync();
            return items.Select(bs => new BookingServiceDTO
            {
                Id = bs.Id,
                BookingId = bs.BookingId,
                ServiceId = bs.ServiceId,
                Quantity = bs.Quantity,
                Price = bs.Price,
                Note = bs.Note,
                Service = bs.Service == null ? null : new ServiceDTO
                {
                    Id = bs.Service.Id,
                    Name = bs.Service.Name,
                    Price = bs.Service.Price,
                    Description = bs.Service.Description,
                    Icon = bs.Service.Icon,
                    Category = bs.Service.Category
                }
            }).ToList();
        }

        // POST: api/BookingServices
        [HttpPost]
        public async Task<IActionResult> AddBookingService([FromBody] BookingServiceDTO dto)
        {
            var booking = await _context.Bookings.FindAsync(dto.BookingId);
            var service = await _context.Services.FindAsync(dto.ServiceId);
            if (booking == null || service == null)
                return BadRequest("Invalid booking or service");
            var item = new BookingService
            {
                BookingId = dto.BookingId,
                ServiceId = dto.ServiceId,
                Quantity = dto.Quantity,
                Price = dto.Price,
                Note = dto.Note
            };
            _context.BookingServices.Add(item);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}