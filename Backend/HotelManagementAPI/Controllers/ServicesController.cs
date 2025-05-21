using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ServicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceDTO>>> GetServices()
        {
            var services = await _context.Services.ToListAsync();

            return services.Select(s => new ServiceDTO
            {
                Id = s.Id,
                Name = s.Name,
                Price = s.Price,
                ChildPrice = s.ChildPrice,
                Description = s.Description,
                UnitType = s.UnitType
            }).ToList();
        }

        // GET: api/Services/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceDTO>> GetService(int id)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
            {
                return NotFound();
            }

            return new ServiceDTO
            {
                Id = service.Id,
                Name = service.Name,
                Price = service.Price,
                ChildPrice = service.ChildPrice,
                Description = service.Description,
                UnitType = service.UnitType
            };
        }

        // POST: api/Services
        [HttpPost]
        public async Task<ActionResult<ServiceDTO>> CreateService(CreateServiceDTO createServiceDTO)
        {
            var service = new Service
            {
                Name = createServiceDTO.Name,
                Price = createServiceDTO.Price,
                ChildPrice = createServiceDTO.ChildPrice,
                Description = createServiceDTO.Description,
                UnitType = createServiceDTO.UnitType
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetService), new { id = service.Id }, new ServiceDTO
            {
                Id = service.Id,
                Name = service.Name,
                Price = service.Price,
                ChildPrice = service.ChildPrice,
                Description = service.Description,
                UnitType = service.UnitType
            });
        }

        // PUT: api/Services/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, UpdateServiceDTO updateServiceDTO)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            service.Name = updateServiceDTO.Name;
            service.Price = updateServiceDTO.Price;
            service.ChildPrice = updateServiceDTO.ChildPrice;
            service.Description = updateServiceDTO.Description;
            service.UnitType = updateServiceDTO.UnitType;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
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

        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceExists(int id)
        {
            return _context.Services.Any(e => e.Id == id);
        }
    }
} 