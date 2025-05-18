using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PermissionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Permissions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PermissionDTO>>> GetPermissions()
        {
            var permissions = await _context.Permissions.ToListAsync();

            return permissions.Select(p => new PermissionDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description
            }).ToList();
        }

        // GET: api/Permissions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PermissionDTO>> GetPermission(int id)
        {
            var permission = await _context.Permissions.FindAsync(id);

            if (permission == null)
            {
                return NotFound();
            }

            return new PermissionDTO
            {
                Id = permission.Id,
                Name = permission.Name,
                Description = permission.Description
            };
        }

        // POST: api/Permissions
        [HttpPost]
        public async Task<ActionResult<PermissionDTO>> CreatePermission(CreatePermissionDTO createPermissionDTO)
        {
            // Kiểm tra xem tên quyền đã tồn tại chưa
            var existingPermission = await _context.Permissions
                .FirstOrDefaultAsync(p => p.Name == createPermissionDTO.Name);
            
            if (existingPermission != null)
            {
                return BadRequest("Permission name already exists");
            }

            var permission = new Permission
            {
                Name = createPermissionDTO.Name,
                Description = createPermissionDTO.Description
            };

            _context.Permissions.Add(permission);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPermission), new { id = permission.Id }, new PermissionDTO
            {
                Id = permission.Id,
                Name = permission.Name,
                Description = permission.Description
            });
        }

        // PUT: api/Permissions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePermission(int id, UpdatePermissionDTO updatePermissionDTO)
        {
            var permission = await _context.Permissions.FindAsync(id);
            if (permission == null)
            {
                return NotFound();
            }

            // Kiểm tra xem tên quyền mới đã tồn tại chưa (nếu thay đổi tên)
            if (permission.Name != updatePermissionDTO.Name)
            {
                var existingPermission = await _context.Permissions
                    .FirstOrDefaultAsync(p => p.Name == updatePermissionDTO.Name);
                
                if (existingPermission != null)
                {
                    return BadRequest("Permission name already exists");
                }
            }

            permission.Name = updatePermissionDTO.Name;
            permission.Description = updatePermissionDTO.Description;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PermissionExists(id))
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

        // DELETE: api/Permissions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePermission(int id)
        {
            var permission = await _context.Permissions.FindAsync(id);
            if (permission == null)
            {
                return NotFound();
            }

            // Kiểm tra xem quyền đã được gán cho vai trò nào chưa
            var hasRoles = await _context.RolePermissions.AnyAsync(rp => rp.PermissionId == id);
            if (hasRoles)
            {
                return BadRequest("Cannot delete permission because it is assigned to roles");
            }

            _context.Permissions.Remove(permission);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PermissionExists(int id)
        {
            return _context.Permissions.Any(e => e.Id == id);
        }
    }
} 