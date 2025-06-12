using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace HotelManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Staff,Customer")]
    public class InvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InvoicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Invoices/auto
        [HttpPost("auto")]
        public async Task<ActionResult<InvoiceDTO>> CreateInvoiceAuto(CreateInvoiceAutoDTO dto)
        {
            var booking = await _context.Bookings
                .Include(b => b.Room)
                .FirstOrDefaultAsync(b => b.Id == dto.BookingId);

            if (booking == null)
            {
                return NotFound("Booking không tồn tại");
            }

            var customer = await _context.Customers.FindAsync(booking.CustomerId);
            if (customer == null)
            {
                return NotFound("Customer không tồn tại");
            }

            // Tính số ngày thuê, tối thiểu 1 ngày
            var totalDays = (booking.CheckOut.Date - booking.CheckIn.Date).Days;
            if (totalDays < 1) totalDays = 1;

            // Tính giá phòng thực tế sau giảm giá
            decimal price = booking.Room.Price;
            if (booking.Room.DiscountPercent.HasValue)
            {
                price = price * (100 - booking.Room.DiscountPercent.Value) / 100;
            }

            // Tính tổng tiền phòng
            decimal totalAmount = totalDays * price;

            // Tính tổng tiền dịch vụ
            var bookingServices = await _context.BookingServices
                .Where(bs => bs.BookingId == booking.Id)
                .Include(bs => bs.Service)
                .ToListAsync();

            decimal totalServiceAmount = 0m;
            foreach (var bs in bookingServices)
            {
                decimal servicePrice = bs.Price == 0 && bs.Service != null ? bs.Service.Price : bs.Price;
                // Giá trong bs.Price đã là giá nhân quantity, nên không nhân thêm quantity nữa
                totalServiceAmount += servicePrice;
            }

            // Cộng tổng tiền dịch vụ vào tổng tiền phòng
            totalAmount += totalServiceAmount;

            // Tạo mã hóa đơn tự động
            string invoiceCode;
            do
            {
                invoiceCode = "INV" + new Random().Next(10000, 99999).ToString();
            } while (await _context.Invoices.AnyAsync(i => i.InvoiceCode == invoiceCode));

            var invoice = new Invoice
            {
                InvoiceCode = invoiceCode,
                CustomerId = customer.Id,
                BookingId = booking.Id,
                CreatedAt = DateTime.Now,
                TotalAmount = totalAmount,
                Status = "Chờ thanh toán",
                PaymentMethod = null,
                Notes = null
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            var invoiceDTO = new InvoiceDTO
            {
                Id = invoice.Id,
                InvoiceCode = invoice.InvoiceCode,
                CustomerId = invoice.CustomerId,
                BookingId = invoice.BookingId,
                CreatedAt = invoice.CreatedAt,
                TotalAmount = invoice.TotalAmount,
                Status = invoice.Status,
                PaymentMethod = invoice.PaymentMethod,
                Notes = invoice.Notes
            };

            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoiceDTO);
        }

        // GET: api/Invoices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetInvoices()
        {
            return await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Booking)
                    .ThenInclude(b => b.BookingServices)
                        .ThenInclude(bs => bs.Service)
                .Select(i => new InvoiceDTO
                {
                    Id = i.Id,
                    InvoiceCode = i.InvoiceCode,
                    CustomerId = i.CustomerId,
                    CustomerName = i.Customer != null ? i.Customer.UserName : null,
                    BookingId = i.BookingId,
                    BookingCode = i.Booking != null ? i.Booking.BookingCode : null,
                    CreatedAt = i.CreatedAt,
                    TotalAmount = i.TotalAmount,
                    Status = i.Status,
                    PaymentMethod = i.PaymentMethod,
                    Notes = i.Notes,
                    Services = i.Booking != null ? i.Booking.BookingServices.Select(bs => new InvoiceServiceDTO
                    {
                        Id = bs.ServiceId,
                        Name = bs.Service.Name,
                        Price = bs.Price,
                        Quantity = bs.Quantity
                    }).ToList() : new List<InvoiceServiceDTO>()
                })
                .ToListAsync();
        }

        // GET: api/Invoices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceDetailDTO>> GetInvoice(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Booking)
                    .ThenInclude(b => b.Room)
                        .ThenInclude(r => r.RoomType)
                .Include(i => i.Booking)
                    .ThenInclude(b => b.BookingServices)
                        .ThenInclude(bs => bs.Service)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null)
            {
                return NotFound();
            }

            return new InvoiceDetailDTO
            {
                Id = invoice.Id,
                InvoiceCode = invoice.InvoiceCode,
                CustomerId = invoice.CustomerId,
                CustomerName = invoice.Customer.UserName,
                CustomerPhone = invoice.Customer.Phone,
                CustomerEmail = invoice.Customer.Email,
                BookingId = invoice.BookingId,
                BookingCode = invoice.Booking.BookingCode,
                RoomNumber = invoice.Booking.Room.RoomNumber,
                RoomType = invoice.Booking.Room.RoomType.Name,
                CheckIn = invoice.Booking.CheckIn,
                CheckOut = invoice.Booking.CheckOut,
                CreatedAt = invoice.CreatedAt,
                TotalAmount = invoice.TotalAmount,
                Status = invoice.Status,
                PaymentMethod = invoice.PaymentMethod,
                Notes = invoice.Notes,
                Services = invoice.Booking.BookingServices.Select(bs => new InvoiceServiceDTO
                {
                    Id = bs.ServiceId,
                    Name = bs.Service.Name,
                    Price = bs.Price,
                    Quantity = bs.Quantity
                }).ToList()
            };
        }

        // GET: api/Invoices/Customer/5
        [HttpGet("Customer/{CustomerId}")]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetInvoicesByCustomer(int CustomerId)
        {
            var Customer = await _context.Customers.FindAsync(CustomerId);
            if (Customer == null)
            {
                return NotFound("Không tìm thấy khách hàng");
            }

            return await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Booking)
                .Where(i => i.CustomerId == CustomerId)
                .Select(i => new InvoiceDTO
                {
                    Id = i.Id,
                    InvoiceCode = i.InvoiceCode,
                    CustomerId = i.CustomerId,
                    CustomerName = i.Customer.UserName,
                    BookingId = i.BookingId,
                    BookingCode = i.Booking.BookingCode,
                    CreatedAt = i.CreatedAt,
                    TotalAmount = i.TotalAmount,
                    Status = i.Status,
                    PaymentMethod = i.PaymentMethod,
                    Notes = i.Notes
                })
                .ToListAsync();
        }

        // POST: api/Invoices
        [HttpPost]
        public async Task<ActionResult<InvoiceDTO>> CreateInvoice(CreateInvoiceDTO createInvoiceDTO)
        {
            // Kiểm tra xem booking có tồn tại không
            var booking = await _context.Bookings
                .Include(b => b.Room)
                .ThenInclude(r => r.RoomType)
                .FirstOrDefaultAsync(b => b.Id == createInvoiceDTO.BookingId);

            if (booking == null)
            {
                return BadRequest("Không tìm thấy đặt phòng");
            }

            // Kiểm tra xem khách hàng có tồn tại không
            var Customer = await _context.Customers.FindAsync(createInvoiceDTO.CustomerId);
            if (Customer == null)
            {
                return BadRequest("Không tìm thấy khách hàng");
            }

            // Kiểm tra xem mã hóa đơn đã tồn tại chưa
            if (await _context.Invoices.AnyAsync(i => i.InvoiceCode == createInvoiceDTO.InvoiceCode))
            {
                return BadRequest("Mã hóa đơn đã tồn tại");
            }

            // Kiểm tra xem đặt phòng đã có hóa đơn chưa
            if (await _context.Invoices.AnyAsync(i => i.BookingId == createInvoiceDTO.BookingId))
            {
                return BadRequest("Đặt phòng này đã có hóa đơn");
            }

            var invoice = new Invoice
            {
                InvoiceCode = createInvoiceDTO.InvoiceCode,
                CustomerId = createInvoiceDTO.CustomerId,
                BookingId = createInvoiceDTO.BookingId,
                CreatedAt = DateTime.Now,
                TotalAmount = createInvoiceDTO.TotalAmount,
                Status = createInvoiceDTO.Status,
                PaymentMethod = createInvoiceDTO.PaymentMethod,
                Notes = createInvoiceDTO.Notes
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, new InvoiceDTO
            {
                Id = invoice.Id,
                InvoiceCode = invoice.InvoiceCode,
                CustomerId = invoice.CustomerId,
                CustomerName = Customer.UserName,
                BookingId = invoice.BookingId,
                BookingCode = booking.BookingCode,
                CreatedAt = invoice.CreatedAt,
                TotalAmount = invoice.TotalAmount,
                Status = invoice.Status,
                PaymentMethod = invoice.PaymentMethod,
                Notes = invoice.Notes
            });
        }

        // PUT: api/Invoices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, UpdateInvoiceDTO updateInvoiceDTO)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }

            // Không cho phép thay đổi mã hóa đơn, Customer và booking
            invoice.TotalAmount = updateInvoiceDTO.TotalAmount;
            invoice.Status = updateInvoiceDTO.Status;
            invoice.PaymentMethod = updateInvoiceDTO.PaymentMethod;
            invoice.Notes = updateInvoiceDTO.Notes;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PATCH: api/Invoices/5/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateInvoiceStatus(int id, InvoiceStatusUpdateDTO statusUpdateDTO)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }

            invoice.Status = statusUpdateDTO.Status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Invoices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool InvoiceExists(int id)
        {
            return _context.Invoices.Any(e => e.Id == id);
        }
    }
}