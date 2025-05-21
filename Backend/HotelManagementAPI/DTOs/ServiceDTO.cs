namespace HotelManagementAPI.DTOs
{
    public class ServiceDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // Tên dịch vụ
        public decimal Price { get; set; } // Giá người lớn
        public decimal? ChildPrice { get; set; } // Giá trẻ em
        public string? Description { get; set; } // Mô tả
        public string? UnitType { get; set; } // Loại đơn vị tính
    }

    public class CreateServiceDTO
    {
        public string Name { get; set; } = string.Empty; // Tên dịch vụ
        public decimal Price { get; set; } // Giá người lớn
        public decimal? ChildPrice { get; set; } // Giá trẻ em
        public string? Description { get; set; } // Mô tả
        public string? UnitType { get; set; } // Loại đơn vị tính
    }

    public class UpdateServiceDTO
    {
        public string Name { get; set; } = string.Empty; // Tên dịch vụ
        public decimal Price { get; set; } // Giá người lớn
        public decimal? ChildPrice { get; set; } // Giá trẻ em
        public string? Description { get; set; } // Mô tả
        public string? UnitType { get; set; } // Loại đơn vị tính
    }
} 