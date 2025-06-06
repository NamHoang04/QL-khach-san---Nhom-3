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
    [Authorize(Roles = "Admin")]
    public class RolesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RolesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDTO>>> GetRoles()
        {
            var roles = await _context.Roles
                .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
                .ToListAsync();

            return roles.Select(r => new RoleDTO
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                Permissions = r.RolePermissions?.Select(rp => rp.Permission?.Name).Where(n => n != null).ToList()
            }).ToList();
        }

        // GET: api/Roles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleDTO>> GetRole(int id)
        {
            var role = await _context.Roles
                .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (role == null)
            {
                return NotFound();
            }

            return new RoleDTO
            {
                Id = role.Id,
                Name = role.Name,
                Description = role.Description,
                Permissions = role.RolePermissions?.Select(rp => rp.Permission?.Name).Where(n => n != null).ToList()
            };
        }

        // POST: api/Roles
        [HttpPost]
        public async Task<ActionResult<RoleDTO>> CreateRole(CreateRoleDTO createRoleDTO)
        {
            // Kiểm tra xem tên vai trò đã tồn tại chưa
            var existingRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.Name == createRoleDTO.Name);
            
            if (existingRole != null)
            {
                return BadRequest("Role name already exists");
            }

            var role = new Role
            {
                Name = createRoleDTO.Name,
                Description = createRoleDTO.Description
            };

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            // Thêm quyền cho vai trò nếu có
            if (createRoleDTO.PermissionIds != null && createRoleDTO.PermissionIds.Any())
            {
                var permissions = await _context.Permissions
                    .Where(p => createRoleDTO.PermissionIds.Contains(p.Id))
                    .ToListAsync();

                if (permissions.Count != createRoleDTO.PermissionIds.Count)
                {
                    return BadRequest("One or more invalid permission IDs");
                }

                foreach (var permissionId in createRoleDTO.PermissionIds)
                {
                    _context.RolePermissions.Add(new RolePermission
                    {
                        RoleId = role.Id,
                        PermissionId = permissionId
                    });
                }

                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetRole), new { id = role.Id }, new RoleDTO
            {
                Id = role.Id,
                Name = role.Name,
                Description = role.Description,
                Permissions = createRoleDTO.PermissionIds != null
                    ? await _context.Permissions
                        .Where(p => createRoleDTO.PermissionIds.Contains(p.Id))
                        .Select(p => p.Name)
                        .ToListAsync()
                    : null
            });
        }

        // PUT: api/Roles/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, UpdateRoleDTO updateRoleDTO)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound();
            }

            // Kiểm tra xem tên vai trò mới đã tồn tại chưa (nếu thay đổi tên)
            if (role.Name != updateRoleDTO.Name)
            {
                var existingRole = await _context.Roles
                    .FirstOrDefaultAsync(r => r.Name == updateRoleDTO.Name);
                
                if (existingRole != null)
                {
                    return BadRequest("Role name already exists");
                }
            }

            role.Name = updateRoleDTO.Name;
            role.Description = updateRoleDTO.Description;

            // Cập nhật quyền cho vai trò nếu có
            if (updateRoleDTO.PermissionIds != null)
            {
                // Kiểm tra quyền hợp lệ
                var permissions = await _context.Permissions
                    .Where(p => updateRoleDTO.PermissionIds.Contains(p.Id))
                    .ToListAsync();

                if (permissions.Count != updateRoleDTO.PermissionIds.Count)
                {
                    return BadRequest("One or more invalid permission IDs");
                }

                // Xóa quyền hiện tại
                var currentPermissions = await _context.RolePermissions
                    .Where(rp => rp.RoleId == id)
                    .ToListAsync();

                _context.RolePermissions.RemoveRange(currentPermissions);

                // Thêm quyền mới
                foreach (var permissionId in updateRoleDTO.PermissionIds)
                {
                    _context.RolePermissions.Add(new RolePermission
                    {
                        RoleId = role.Id,
                        PermissionId = permissionId
                    });
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleExists(id))
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

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound();
            }

            // Kiểm tra xem vai trò đã được gán cho Admin nào chưa
            var hasAdmins = await _context.AdminRoles.AnyAsync(ar => ar.RoleId == id);
            if (hasAdmins)
            {
                return BadRequest("Cannot delete role because it is assigned to Admins");
            }

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoleExists(int id)
        {
            return _context.Roles.Any(e => e.Id == id);
        }
    }
}