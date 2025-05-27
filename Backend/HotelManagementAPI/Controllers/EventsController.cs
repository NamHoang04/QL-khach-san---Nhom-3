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
    [Authorize(Roles = "admin,staff,janitor")]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDTO>>> GetEvents()
        {
            var events = await _context.Events.ToListAsync();

            return events.Select(e => new EventDTO
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                Location = e.Location,
                StartTime = e.StartTime,
                EndTime = e.EndTime,
                EventDate = e.EventDate,
                ImageUrl = e.ImageUrl
            }).ToList();
        }

        // GET: api/Events/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EventDTO>> GetEvent(int id)
        {
            var @event = await _context.Events.FindAsync(id);

            if (@event == null)
            {
                return NotFound();
            }

            return new EventDTO
            {
                Id = @event.Id,
                Name = @event.Name,
                Description = @event.Description,
                Location = @event.Location,
                StartTime = @event.StartTime,
                EndTime = @event.EndTime,
                EventDate = @event.EventDate,
                ImageUrl = @event.ImageUrl
            };
        }

        // POST: api/Events
        [HttpPost]
        public async Task<ActionResult<EventDTO>> CreateEvent(CreateEventDTO createEventDTO)
        {
            var @event = new Event
            {
                Name = createEventDTO.Name,
                Description = createEventDTO.Description,
                Location = createEventDTO.Location,
                StartTime = createEventDTO.StartTime,
                EndTime = createEventDTO.EndTime,
                EventDate = createEventDTO.EventDate,
                ImageUrl = createEventDTO.ImageUrl
            };

            _context.Events.Add(@event);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = @event.Id }, new EventDTO
            {
                Id = @event.Id,
                Name = @event.Name,
                Description = @event.Description,
                Location = @event.Location,
                StartTime = @event.StartTime,
                EndTime = @event.EndTime,
                EventDate = @event.EventDate,
                ImageUrl = @event.ImageUrl
            });
        }

        // PUT: api/Events/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, UpdateEventDTO updateEventDTO)
        {
            var @event = await _context.Events.FindAsync(id);
            if (@event == null)
            {
                return NotFound();
            }

            @event.Name = updateEventDTO.Name;
            @event.Description = updateEventDTO.Description;
            @event.Location = updateEventDTO.Location;
            @event.StartTime = updateEventDTO.StartTime;
            @event.EndTime = updateEventDTO.EndTime;
            @event.EventDate = updateEventDTO.EventDate;
            @event.ImageUrl = updateEventDTO.ImageUrl;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(id))
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

        // DELETE: api/Events/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var @event = await _context.Events.FindAsync(id);
            if (@event == null)
            {
                return NotFound();
            }

            _context.Events.Remove(@event);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventExists(int id)
        {
            return _context.Events.Any(e => e.Id == id);
        }
    }
}