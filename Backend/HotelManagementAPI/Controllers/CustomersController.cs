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
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDTO>>> GetCustomers()
        {
            return await _context.Customers
                .Select(c => new CustomerDTO
                {
                    Id = c.Id,
                    CustomerCode = c.CustomerCode,
                    FullName = c.FullName,
                    UserName = c.UserName,
                    Email = c.Email,
                    Phone = c.Phone,
                    IdentityNumber = c.IdentityNumber,
                    Address = c.Address
                })
                .ToListAsync();
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDTO>> GetCustomer(int id)
        {
            var Customer = await _context.Customers.FindAsync(id);

            if (Customer == null)
            {
                return NotFound();
            }

            return new CustomerDTO
            {
                Id = Customer.Id,
                CustomerCode = Customer.CustomerCode,
                FullName = Customer.FullName,
                UserName = Customer.UserName,
                Email = Customer.Email,
                Phone = Customer.Phone,
                IdentityNumber = Customer.IdentityNumber,
                Address = Customer.Address
            };
        }

        // GET: api/Customers/search?query=NguyenVan
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<CustomerDTO>>> SearchCustomers(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return await GetCustomers();
            }

            return await _context.Customers
                .Where(c => c.UserName.Contains(query) || 
                            c.CustomerCode.Contains(query) || 
                            c.Phone.Contains(query) || 
                            c.Email.Contains(query))
                .Select(c => new CustomerDTO
                {
                    Id = c.Id,
                    CustomerCode = c.CustomerCode,
                    UserName = c.UserName,
                    Email = c.Email,
                    Phone = c.Phone,
                    IdentityNumber = c.IdentityNumber,
                    Address = c.Address
                })
                .ToListAsync();
        }

        // POST: api/Customers
        [HttpPost]
        public async Task<ActionResult<CustomerDTO>> CreateCustomer(CreateCustomerDTO createCustomerDTO)
        {
            // Kiểm tra xem mã khách hàng đã tồn tại chưa
            if (await _context.Customers.AnyAsync(c => c.CustomerCode == createCustomerDTO.CustomerCode))
            {
                return BadRequest("Mã khách hàng đã tồn tại");
            }

            var Customer = new Customer
            {
                CustomerCode = createCustomerDTO.CustomerCode,
                UserName = createCustomerDTO.UserName,
                Email = createCustomerDTO.Email,
                Phone = createCustomerDTO.Phone,
                IdentityNumber = createCustomerDTO.IdentityNumber,
                Address = createCustomerDTO.Address
            };

            _context.Customers.Add(Customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomer), new { id = Customer.Id }, new CustomerDTO
            {
                Id = Customer.Id,
                CustomerCode = Customer.CustomerCode,
                UserName = Customer.UserName,
                Email = Customer.Email,
                Phone = Customer.Phone,
                IdentityNumber = Customer.IdentityNumber,
                Address = Customer.Address
            });
        }

        // PUT: api/Customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, UpdateCustomerDTO updateCustomerDTO)
        {
            var Customer = await _context.Customers.FindAsync(id);
            if (Customer == null)
            {
                return NotFound();
            }

            // Nếu mã khách hàng thay đổi, kiểm tra xem mã mới đã tồn tại chưa
            if (updateCustomerDTO.CustomerCode != Customer.CustomerCode &&
                await _context.Customers.AnyAsync(c => c.CustomerCode == updateCustomerDTO.CustomerCode))
            {
                return BadRequest("Mã khách hàng đã tồn tại");
            }

            Customer.CustomerCode = updateCustomerDTO.CustomerCode;
            Customer.UserName = updateCustomerDTO.UserName;
            Customer.Email = updateCustomerDTO.Email;
            Customer.Phone = updateCustomerDTO.Phone;
            Customer.IdentityNumber = updateCustomerDTO.IdentityNumber;
            Customer.Address = updateCustomerDTO.Address;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var Customer = await _context.Customers.FindAsync(id);
            if (Customer == null)
            {
                return NotFound();
            }

            // Kiểm tra xem khách hàng có liên kết với các đặt phòng không
            bool hasBookings = await _context.Bookings.AnyAsync(b => b.CustomerId == id);
            if (hasBookings)
            {
                return BadRequest("Không thể xóa khách hàng vì đã có đặt phòng liên quan");
            }

            _context.Customers.Remove(Customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }
    }
}