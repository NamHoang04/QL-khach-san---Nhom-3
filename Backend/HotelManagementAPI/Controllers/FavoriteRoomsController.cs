using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace HotelManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    public class FavoriteRoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public FavoriteRoomsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/FavoriteRooms?CustomerId=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FavoriteRoomDTO>>> GetFavoriteRooms([FromQuery] int CustomerId)
        {
            var favorites = await _context.FavoriteRooms
                .Where(f => f.CustomerId == CustomerId)
                .Include(f => f.Room)
                .ThenInclude(r => r.RoomType)
                .ToListAsync();
            return favorites.Select(f => new FavoriteRoomDTO
            {
                CustomerId = f.CustomerId,
                RoomId = f.RoomId,
                Room = f.Room == null ? null : new RoomDTO
                {
                    Id = f.Room.Id,
                    RoomNumber = f.Room.RoomNumber,
                    RoomTypeId = f.Room.RoomTypeId,
                    Floor = f.Room.Floor,
                    Price = f.Room.Price,
                    Status = f.Room.Status,
                    RoomTypeName = f.Room.RoomType?.Name,
                    IsFeatured = f.Room.IsFeatured,
                    DiscountPercent = f.Room.DiscountPercent,
                    OriginalPrice = f.Room.OriginalPrice,
                    Rating = f.Room.Rating
                }
            }).ToList();
        }

        // POST: api/FavoriteRooms
        [HttpPost]
        public async Task<IActionResult> AddFavorite([FromBody] FavoriteRoomDTO dto)
        {
            var exists = await _context.FavoriteRooms.AnyAsync(f => f.CustomerId == dto.CustomerId && f.RoomId == dto.RoomId);
            if (exists)
                return BadRequest("Room already favorited");
            var favorite = new FavoriteRoom { CustomerId = dto.CustomerId, RoomId = dto.RoomId };
            _context.FavoriteRooms.Add(favorite);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // DELETE: api/FavoriteRooms?CustomerId=1&roomId=2
        [HttpDelete]
        public async Task<IActionResult> RemoveFavorite([FromQuery] int CustomerId, [FromQuery] int roomId)
        {
            var favorite = await _context.FavoriteRooms.FindAsync(CustomerId, roomId);
            if (favorite == null)
                return NotFound();
            _context.FavoriteRooms.Remove(favorite);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}