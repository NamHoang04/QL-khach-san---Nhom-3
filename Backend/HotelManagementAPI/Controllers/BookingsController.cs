using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDTO>>> GetBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Room)
                .ThenInclude(r => r.RoomType)
                .ToListAsync();

            return bookings.Select(b => new BookingDTO
            {
                Id = b.Id,
                BookingCode = b.BookingCode,
                CustomerId = b.CustomerId,
                RoomId = b.RoomId,
                CheckIn = b.CheckIn,
                CheckOut = b.CheckOut,
                Status = b.Status,
                CustomerName = b.Customer?.FullName,
                CustomerEmail = b.Customer?.Email,
                RoomNumber = b.Room?.RoomNumber,
                RoomTypeName = b.Room?.RoomType?.Name
            }).ToList();
        }

        // GET: api/Bookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDTO>> GetBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Room)
                .ThenInclude(r => r.RoomType)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
            {
                return NotFound();
            }

            return new BookingDTO
            {
                Id = booking.Id,
                BookingCode = booking.BookingCode,
                CustomerId = booking.CustomerId,
                RoomId = booking.RoomId,
                CheckIn = booking.CheckIn,
                CheckOut = booking.CheckOut,
                Status = booking.Status,
                CustomerName = booking.Customer?.FullName,
                CustomerEmail = booking.Customer?.Email,
                RoomNumber = booking.Room?.RoomNumber,
                RoomTypeName = booking.Room?.RoomType?.Name
            };
        }

        // POST: api/Bookings
        [HttpPost]
        public async Task<ActionResult<BookingDTO>> CreateBooking(CreateBookingDTO createBookingDTO)
        {
            var customer = await _context.Customers.FindAsync(createBookingDTO.CustomerId);
            if (customer == null)
            {
                return BadRequest("Invalid customer ID");
            }

            var room = await _context.Rooms
                .Include(r => r.RoomType)
                .FirstOrDefaultAsync(r => r.Id == createBookingDTO.RoomId);
            if (room == null)
            {
                return BadRequest("Invalid room ID");
            }

            // Kiểm tra phòng đã được đặt trong thời gian này chưa
            var isRoomBooked = await _context.Bookings
                .AnyAsync(b => b.RoomId == createBookingDTO.RoomId &&
                               b.Status != "Cancelled" &&
                               ((b.CheckIn <= createBookingDTO.CheckIn && b.CheckOut >= createBookingDTO.CheckIn) ||
                                (b.CheckIn <= createBookingDTO.CheckOut && b.CheckOut >= createBookingDTO.CheckOut) ||
                                (b.CheckIn >= createBookingDTO.CheckIn && b.CheckOut <= createBookingDTO.CheckOut)));

            if (isRoomBooked)
            {
                return BadRequest("Room is already booked for the selected dates");
            }

            var booking = new Booking
            {
                BookingCode = createBookingDTO.BookingCode,
                CustomerId = createBookingDTO.CustomerId,
                RoomId = createBookingDTO.RoomId,
                CheckIn = createBookingDTO.CheckIn,
                CheckOut = createBookingDTO.CheckOut,
                Status = createBookingDTO.Status ?? "Pending"
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, new BookingDTO
            {
                Id = booking.Id,
                BookingCode = booking.BookingCode,
                CustomerId = booking.CustomerId,
                RoomId = booking.RoomId,
                CheckIn = booking.CheckIn,
                CheckOut = booking.CheckOut,
                Status = booking.Status,
                CustomerName = customer.FullName,
                CustomerEmail = customer.Email,
                RoomNumber = room.RoomNumber,
                RoomTypeName = room.RoomType?.Name
            });
        }

        // PUT: api/Bookings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, UpdateBookingDTO updateBookingDTO)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            var customer = await _context.Customers.FindAsync(updateBookingDTO.CustomerId);
            if (customer == null)
            {
                return BadRequest("Invalid customer ID");
            }

            var room = await _context.Rooms.FindAsync(updateBookingDTO.RoomId);
            if (room == null)
            {
                return BadRequest("Invalid room ID");
            }

            // Kiểm tra phòng đã được đặt trong thời gian này chưa (trừ booking hiện tại)
            var isRoomBooked = await _context.Bookings
                .AnyAsync(b => b.Id != id &&
                               b.RoomId == updateBookingDTO.RoomId &&
                               b.Status != "Cancelled" &&
                               ((b.CheckIn <= updateBookingDTO.CheckIn && b.CheckOut >= updateBookingDTO.CheckIn) ||
                                (b.CheckIn <= updateBookingDTO.CheckOut && b.CheckOut >= updateBookingDTO.CheckOut) ||
                                (b.CheckIn >= updateBookingDTO.CheckIn && b.CheckOut <= updateBookingDTO.CheckOut)));

            if (isRoomBooked)
            {
                return BadRequest("Room is already booked for the selected dates");
            }

            booking.CustomerId = updateBookingDTO.CustomerId;
            booking.RoomId = updateBookingDTO.RoomId;
            booking.CheckIn = updateBookingDTO.CheckIn;
            booking.CheckOut = updateBookingDTO.CheckOut;
            booking.Status = updateBookingDTO.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(id))
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

        // PATCH: api/Bookings/5/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateBookingStatus(int id, BookingStatusUpdateDTO statusUpdateDTO)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            booking.Status = statusUpdateDTO.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(id))
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

        // DELETE: api/Bookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            // Soft delete (thay đổi trạng thái thành "Cancelled")
            booking.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookingExists(int id)
        {
            return _context.Bookings.Any(e => e.Id == id);
        }
    }
} 