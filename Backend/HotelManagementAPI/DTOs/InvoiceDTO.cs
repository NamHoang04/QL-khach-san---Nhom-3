using System;
using System.Collections.Generic;

namespace HotelManagementAPI.DTOs
{
    public class InvoiceDTO
    {
        public int Id { get; set; }
        public string InvoiceCode { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public int? BookingId { get; set; }
        public string? BookingCode { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Status { get; set; }
        public string? PaymentMethod { get; set; }
        public string? Notes { get; set; }
        public List<InvoiceServiceDTO>? Services { get; set; }
    }

    public class InvoiceDetailDTO
    {
        public int Id { get; set; }
        public string InvoiceCode { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public string? CustomerEmail { get; set; }
        public int? BookingId { get; set; }
        public string? BookingCode { get; set; }
        public string? RoomNumber { get; set; }
        public string? RoomType { get; set; }
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Status { get; set; }
        public string? PaymentMethod { get; set; }
        public string? Notes { get; set; }
        public List<InvoiceServiceDTO>? Services { get; set; }
    }

    public class CreateInvoiceDTO
    {
        public string InvoiceCode { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public int? BookingId { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Status { get; set; } = "Chờ thanh toán";
        public string? PaymentMethod { get; set; } = "Tiền mặt";
        public string? Notes { get; set; }
        public List<BookingServiceDTO>? Services { get; set; }
    }

    public class UpdateInvoiceDTO
    {
        public decimal TotalAmount { get; set; }
        public string? Status { get; set; }
        public string? PaymentMethod { get; set; }
        public string? Notes { get; set; }
    }

    public class InvoiceStatusUpdateDTO
    {
        public string Status { get; set; } = string.Empty;
    }

    public class InvoiceServiceDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
} 