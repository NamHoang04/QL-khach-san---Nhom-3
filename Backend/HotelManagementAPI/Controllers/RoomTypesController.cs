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
    public class RoomTypesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RoomTypesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/RoomTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomTypeDTO>>> GetRoomTypes()
        {
            var roomTypes = await _context.RoomTypes.ToListAsync();

            return roomTypes.Select(rt => new RoomTypeDTO
            {
                Id = rt.Id,
                Name = rt.Name,
                Price = rt.Price,
                Description = rt.Description,
                Area = rt.Area,
                MaxGuests = rt.MaxGuests,
                Amenities = rt.Amenities,
                ImageUrl = rt.ImageUrl
            }).ToList();
        }

        // GET: api/RoomTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomTypeDTO>> GetRoomType(int id)
        {
            var roomType = await _context.RoomTypes.FindAsync(id);

            if (roomType == null)
            {
                return NotFound();
            }

            return new RoomTypeDTO
            {
                Id = roomType.Id,
                Name = roomType.Name,
                Price = roomType.Price,
                Description = roomType.Description,
                Area = roomType.Area,
                MaxGuests = roomType.MaxGuests,
                Amenities = roomType.Amenities,
                ImageUrl = roomType.ImageUrl
            };
        }

        // POST: api/RoomTypes
        [HttpPost]
        public async Task<ActionResult<RoomTypeDTO>> CreateRoomType(CreateRoomTypeDTO createRoomTypeDTO)
        {
            var roomType = new RoomType
            {
                Name = createRoomTypeDTO.Name,
                Price = createRoomTypeDTO.Price,
                Description = createRoomTypeDTO.Description,
                Area = createRoomTypeDTO.Area,
                MaxGuests = createRoomTypeDTO.MaxGuests,
                Amenities = createRoomTypeDTO.Amenities,
                ImageUrl = createRoomTypeDTO.ImageUrl
            };

            _context.RoomTypes.Add(roomType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoomType), new { id = roomType.Id }, new RoomTypeDTO
            {
                Id = roomType.Id,
                Name = roomType.Name,
                Price = roomType.Price,
                Description = roomType.Description,
                Area = roomType.Area,
                MaxGuests = roomType.MaxGuests,
                Amenities = roomType.Amenities,
                ImageUrl = roomType.ImageUrl
            });
        }

        // PUT: api/RoomTypes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoomType(int id, UpdateRoomTypeDTO updateRoomTypeDTO)
        {
            var roomType = await _context.RoomTypes.FindAsync(id);
            if (roomType == null)
            {
                return NotFound();
            }

            roomType.Name = updateRoomTypeDTO.Name;
            roomType.Price = updateRoomTypeDTO.Price;
            roomType.Description = updateRoomTypeDTO.Description;
            roomType.Area = updateRoomTypeDTO.Area;
            roomType.MaxGuests = updateRoomTypeDTO.MaxGuests;
            roomType.Amenities = updateRoomTypeDTO.Amenities;
            roomType.ImageUrl = updateRoomTypeDTO.ImageUrl;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomTypeExists(id))
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

        // DELETE: api/RoomTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomType(int id)
        {
            var roomType = await _context.RoomTypes.FindAsync(id);
            if (roomType == null)
            {
                return NotFound();
            }

            // Kiểm tra xem có phòng nào đang sử dụng loại phòng này không
            var hasRooms = await _context.Rooms.AnyAsync(r => r.RoomTypeId == id);
            if (hasRooms)
            {
                return BadRequest("Cannot delete room type because it is used by existing rooms");
            }

            _context.RoomTypes.Remove(roomType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoomTypeExists(int id)
        {
            return _context.RoomTypes.Any(e => e.Id == id);
        }
    }
}