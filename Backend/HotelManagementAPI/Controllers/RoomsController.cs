using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Staff,janitor,Customer")]
    public class RoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RoomsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDTO>>> GetRooms()
        {
            var rooms = await _context.Rooms
                .Include(r => r.RoomType)
                .ToListAsync();

            return rooms.Select(r => new RoomDTO
            {
                Id = r.Id,
                RoomNumber = r.RoomNumber,
                RoomTypeId = r.RoomTypeId,
                Floor = r.Floor,
                Price = r.Price,
                Status = r.Status,
                RoomTypeName = r.RoomType?.Name
            }).ToList();
        }

        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDTO>> GetRoom(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.RoomType)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
            {
                return NotFound();
            }

            return new RoomDTO
            {
                Id = room.Id,
                RoomNumber = room.RoomNumber,
                RoomTypeId = room.RoomTypeId,
                Floor = room.Floor,
                Price = room.Price,
                Status = room.Status,
                RoomTypeName = room.RoomType?.Name
            };
        }

        // POST: api/Rooms
        [HttpPost]
        public async Task<ActionResult<RoomDTO>> CreateRoom(CreateRoomDTO createRoomDTO)
        {
            var roomType = await _context.RoomTypes.FindAsync(createRoomDTO.RoomTypeId);
            if (roomType == null)
            {
                return BadRequest("Invalid room type ID");
            }

            var room = new Room
            {
                RoomNumber = createRoomDTO.RoomNumber,
                RoomTypeId = createRoomDTO.RoomTypeId,
                Floor = createRoomDTO.Floor,
                Price = createRoomDTO.Price,
                Status = createRoomDTO.Status
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, new RoomDTO
            {
                Id = room.Id,
                RoomNumber = room.RoomNumber,
                RoomTypeId = room.RoomTypeId,
                Floor = room.Floor,
                Price = room.Price,
                Status = room.Status,
                RoomTypeName = roomType.Name
            });
        }

        // PUT: api/Rooms/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, UpdateRoomDTO updateRoomDTO)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            var roomType = await _context.RoomTypes.FindAsync(updateRoomDTO.RoomTypeId);
            if (roomType == null)
            {
                return BadRequest("Invalid room type ID");
            }

            room.RoomNumber = updateRoomDTO.RoomNumber;
            room.RoomTypeId = updateRoomDTO.RoomTypeId;
            room.Floor = updateRoomDTO.Floor;
            room.Price = updateRoomDTO.Price;
            room.Status = updateRoomDTO.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomExists(id))
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

        // DELETE: api/Rooms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }
    }
}