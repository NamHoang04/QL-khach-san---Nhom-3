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
                Price = bs.Price == 0 && bs.Service != null ? bs.Service.Price * bs.Quantity : bs.Price,
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

        // GET: api/BookingServices/totalPrice?bookingId=1
        [HttpGet("totalPrice")]
        public async Task<ActionResult<decimal>> GetTotalPrice([FromQuery] int bookingId)
        {
            var services = await _context.BookingServices
                .Where(bs => bs.BookingId == bookingId)
                .ToListAsync();

            if (services == null || services.Count == 0)
            {
                return Ok(0m);
            }

            decimal totalPrice = 0m;
            foreach (var service in services)
            {
                decimal price = service.Price;
                if (price == 0 && service.Service != null)
                {
                    price = service.Service.Price;
                }
                totalPrice += price * service.Quantity;
            }

            return Ok(totalPrice);
        }

        // POST: api/BookingServices
        [HttpPost]
        public async Task<IActionResult> AddBookingService([FromBody] BookingServiceDTO dto)
        {
            var booking = await _context.Bookings.FindAsync(dto.BookingId);
            var service = await _context.Services.FindAsync(dto.ServiceId);
            if (booking == null || service == null)
                return BadRequest("Invalid booking or service");

            decimal price = dto.Price;
            if (price == 0)
            {
                price = service.Price * dto.Quantity;
            }

            var item = new BookingService
            {
                BookingId = dto.BookingId,
                ServiceId = dto.ServiceId,
                Quantity = dto.Quantity,
                Price = price,
                Note = dto.Note
            };
            _context.BookingServices.Add(item);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // DELETE: api/BookingServices/ByBooking/5
        [HttpDelete("ByBooking/{bookingId}")]
        public async Task<IActionResult> DeleteBookingServices(int bookingId)
        {
            var itemsToDelete = await _context.BookingServices
                .Where(bs => bs.BookingId == bookingId)
                .ToListAsync();

            if (itemsToDelete.Any())
            {
                _context.BookingServices.RemoveRange(itemsToDelete);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}