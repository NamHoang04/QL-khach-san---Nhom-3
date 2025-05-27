using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin,staff,customer")]
    public class InvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InvoicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Invoices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetInvoices()
        {
            return await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Booking)
                .Select(i => new InvoiceDTO
                {
                    Id = i.Id,
                    InvoiceCode = i.InvoiceCode,
                    CustomerId = i.CustomerId,
                    CustomerName = i.Customer.FullName,
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

        // GET: api/Invoices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceDetailDTO>> GetInvoice(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Booking)
                .ThenInclude(b => b.Room)
                .ThenInclude(r => r.RoomType)
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
                CustomerName = invoice.Customer.FullName,
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
                Notes = invoice.Notes
            };
        }

        // GET: api/Invoices/customer/5
        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetInvoicesByCustomer(int customerId)
        {
            var customer = await _context.Customers.FindAsync(customerId);
            if (customer == null)
            {
                return NotFound("Không tìm thấy khách hàng");
            }

            return await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Booking)
                .Where(i => i.CustomerId == customerId)
                .Select(i => new InvoiceDTO
                {
                    Id = i.Id,
                    InvoiceCode = i.InvoiceCode,
                    CustomerId = i.CustomerId,
                    CustomerName = i.Customer.FullName,
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
            var customer = await _context.Customers.FindAsync(createInvoiceDTO.CustomerId);
            if (customer == null)
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
                CustomerName = customer.FullName,
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

            // Không cho phép thay đổi mã hóa đơn, customer và booking
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