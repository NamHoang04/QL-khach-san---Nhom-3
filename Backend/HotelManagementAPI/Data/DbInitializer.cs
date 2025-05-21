using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace HotelManagementAPI.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            // Kiểm tra xem đã có dữ liệu trong database chưa
            if (context.RoomTypes.Any())
            {
                return; // Database đã có dữ liệu mẫu
            }

            // Thêm loại phòng
            var roomTypes = new RoomType[]
            {
                new RoomType
                {
                    Name = "Phòng Standard",
                    Price = 750000,
                    Description = "Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản, thích hợp cho 2 người.",
                    Area = 25,
                    MaxGuests = 2,
                    Amenities = "Wifi miễn phí, TV",
                    ImageUrl = "https://example.com/standard-room.jpg"
                },
                new RoomType
                {
                    Name = "Phòng Deluxe",
                    Price = 1200000,
                    Description = "Phòng cao cấp với không gian rộng và tầm nhìn đẹp, phù hợp cho gia đình nhỏ.",
                    Area = 35,
                    MaxGuests = 4,
                    Amenities = "Wifi miễn phí, TV + Minibar",
                    ImageUrl = "https://example.com/deluxe-room.jpg"
                },
                new RoomType
                {
                    Name = "Phòng Suite",
                    Price = 2500000,
                    Description = "Phòng Suite sang trọng với phòng khách riêng biệt, tầm nhìn panorama.",
                    Area = 50,
                    MaxGuests = 4,
                    Amenities = "Bồn tắm spa, Bữa sáng miễn phí",
                    ImageUrl = "https://example.com/suite-room.jpg"
                },
                new RoomType
                {
                    Name = "Phòng Family",
                    Price = 1400000,
                    Description = "Phòng gia đình rộng rãi với 2 giường lớn, thích hợp cho gia đình có trẻ em.",
                    Area = 45,
                    MaxGuests = 6,
                    Amenities = "Wifi miễn phí, TV, Tủ lạnh",
                    ImageUrl = "https://example.com/family-room.jpg"
                }
            };

            foreach (RoomType rt in roomTypes)
            {
                context.RoomTypes.Add(rt);
            }
            context.SaveChanges();

            // Thêm phòng
            var rooms = new Room[]
            {
                new Room { RoomNumber = "101", RoomTypeId = roomTypes[0].Id, Floor = 1, Price = 750000, Status = "Sẵn sàng" },
                new Room { RoomNumber = "102", RoomTypeId = roomTypes[1].Id, Floor = 1, Price = 1200000, Status = "Đang sử dụng" },
                new Room { RoomNumber = "201", RoomTypeId = roomTypes[2].Id, Floor = 2, Price = 1800000, Status = "Sẵn sàng" },
                new Room { RoomNumber = "202", RoomTypeId = roomTypes[3].Id, Floor = 2, Price = 1400000, Status = "Bảo trì" }
            };

            foreach (Room r in rooms)
            {
                context.Rooms.Add(r);
            }
            context.SaveChanges();

            // Thêm khách hàng
            var customers = new Customer[]
            {
                new Customer
                {
                    CustomerCode = "KH001",
                    FullName = "Nguyễn Văn A",
                    Email = "nguyenvana@gmail.com",
                    Phone = "0901234567",
                    IdentityNumber = "079201012345"
                },
                new Customer
                {
                    CustomerCode = "KH002",
                    FullName = "Trần Thị B",
                    Email = "tranthib@gmail.com",
                    Phone = "0912345678",
                    IdentityNumber = "079201054321"
                },
                new Customer
                {
                    CustomerCode = "KH003",
                    FullName = "Lê Văn C",
                    Email = "levanc@gmail.com",
                    Phone = "0987654321",
                    IdentityNumber = "079201067890"
                }
            };

            foreach (Customer c in customers)
            {
                context.Customers.Add(c);
            }
            context.SaveChanges();

            // Thêm booking
            var bookings = new Booking[]
            {
                new Booking
                {
                    BookingCode = "B00123",
                    CustomerId = customers[0].Id,
                    RoomId = rooms[0].Id,
                    CheckIn = DateTime.Parse("2024-06-01"),
                    CheckOut = DateTime.Parse("2024-06-03"),
                    Status = "Đã xác nhận"
                },
                new Booking
                {
                    BookingCode = "B00124",
                    CustomerId = customers[1].Id,
                    RoomId = rooms[1].Id,
                    CheckIn = DateTime.Parse("2024-06-05"),
                    CheckOut = DateTime.Parse("2024-06-10"),
                    Status = "Chờ xác nhận"
                }
            };

            foreach (Booking b in bookings)
            {
                context.Bookings.Add(b);
            }
            context.SaveChanges();

            // Thêm hóa đơn
            var invoices = new Invoice[]
            {
                new Invoice
                {
                    InvoiceCode = "INV00123",
                    CustomerId = customers[0].Id,
                    BookingId = bookings[0].Id,
                    CreatedAt = DateTime.Parse("2024-06-05"),
                    TotalAmount = 4500000,
                    Status = "Đã thanh toán"
                },
                new Invoice
                {
                    InvoiceCode = "INV00124",
                    CustomerId = customers[1].Id,
                    BookingId = bookings[1].Id,
                    CreatedAt = DateTime.Parse("2024-06-04"),
                    TotalAmount = 7200000,
                    Status = "Chờ thanh toán"
                }
            };

            foreach (Invoice i in invoices)
            {
                context.Invoices.Add(i);
            }
            context.SaveChanges();

            // Thêm dịch vụ
            var services = new Service[]
            {
                new Service
                {
                    Name = "Buffet sáng",
                    Price = 250000,
                    ChildPrice = 200000,
                    Description = "Buffet sáng với đa dạng món ăn Á - Âu, phù hợp cho cả gia đình",
                    UnitType = "người"
                },
                new Service
                {
                    Name = "Spa & Massage",
                    Price = 850000,
                    Description = "Dịch vụ spa và massage cao cấp, giúp thư giãn và làm đẹp",
                    UnitType = "người"
                },
                new Service
                {
                    Name = "Dịch vụ giặt ủi",
                    Price = 150000,
                    Description = "Dịch vụ giặt và ủi quần áo chuyên nghiệp, đảm bảo sạch sẽ và phẳng phiu",
                    UnitType = "kg"
                },
                new Service
                {
                    Name = "Đưa đón sân bay",
                    Price = 400000,
                    ChildPrice = 200000,
                    Description = "Dịch vụ đưa đón sân bay sang trọng, thoải mái với xe riêng",
                    UnitType = "người"
                }
            };

            foreach (Service s in services)
            {
                context.Services.Add(s);
            }
            context.SaveChanges();

            // Thêm sự kiện
            var events = new Event[]
            {
                new Event
                {
                    Name = "Tiệc cưới bãi biển",
                    Description = "Tổ chức tiệc cưới lãng mạn bên bờ biển với dịch vụ cao cấp và trọn gói.",
                    Location = "Bãi biển",
                    StartTime = DateTime.Parse("2024-06-15 19:00"),
                    EndTime = DateTime.Parse("2024-06-15 22:00"),
                    EventDate = DateTime.Parse("2024-06-15"),
                    ImageUrl = "https://example.com/beach-wedding.jpg"
                },
                new Event
                {
                    Name = "Hội nghị doanh nghiệp",
                    Description = "Hội nghị thường niên của các doanh nghiệp trong ngành công nghệ.",
                    Location = "Phòng hội nghị A",
                    StartTime = DateTime.Parse("2024-06-20 08:00"),
                    EndTime = DateTime.Parse("2024-06-20 17:00"),
                    EventDate = DateTime.Parse("2024-06-20"),
                    ImageUrl = "https://example.com/business-conference.jpg"
                },
                new Event
                {
                    Name = "Tiệc Pool Party",
                    Description = "Tiệc bên hồ bơi với âm nhạc sôi động, đồ uống và BBQ.",
                    Location = "Hồ bơi",
                    StartTime = DateTime.Parse("2024-06-25 14:00"),
                    EndTime = DateTime.Parse("2024-06-25 21:00"),
                    EventDate = DateTime.Parse("2024-06-25"),
                    ImageUrl = "https://example.com/pool-party.jpg"
                }
            };

            foreach (Event e in events)
            {
                context.Events.Add(e);
            }
            context.SaveChanges();

            // Thêm nhân viên
            var staffs = new Staff[]
            {
                new Staff
                {
                    StaffCode = "NV001",
                    FullName = "Nguyễn Thị Hương",
                    Email = "huong.nguyen@hotel.com",
                    Phone = "0901234567",
                    Position = "Lễ tân",
                    Status = "Đang làm việc",
                    AvatarUrl = "https://example.com/staff1.jpg"
                },
                new Staff
                {
                    StaffCode = "NV002",
                    FullName = "Trần Văn Minh",
                    Email = "minh.tran@hotel.com",
                    Phone = "0912345678",
                    Position = "Quản lý khu vực",
                    Status = "Đang làm việc",
                    AvatarUrl = "https://example.com/staff2.jpg"
                },
                new Staff
                {
                    StaffCode = "NV003",
                    FullName = "Lê Thị Mai",
                    Email = "mai.le@hotel.com",
                    Phone = "0987654321",
                    Position = "Nhân viên dịch vụ",
                    Status = "Tạm nghỉ",
                    AvatarUrl = "https://example.com/staff3.jpg"
                }
            };

            foreach (Staff s in staffs)
            {
                context.Staffs.Add(s);
            }
            context.SaveChanges();

            // Thêm quyền
            var permissions = new Permission[]
            {
                new Permission { Name = "view_rooms", Description = "Xem danh sách phòng" },
                new Permission { Name = "edit_rooms", Description = "Thêm, sửa, xóa phòng" },
                new Permission { Name = "view_bookings", Description = "Xem danh sách đặt phòng" },
                new Permission { Name = "edit_bookings", Description = "Thêm, sửa, xóa đặt phòng" },
                new Permission { Name = "view_customers", Description = "Xem danh sách khách hàng" },
                new Permission { Name = "edit_customers", Description = "Thêm, sửa, xóa khách hàng" },
                new Permission { Name = "view_invoices", Description = "Xem danh sách hóa đơn" },
                new Permission { Name = "edit_invoices", Description = "Thêm, sửa, xóa hóa đơn" },
                new Permission { Name = "view_staff", Description = "Xem danh sách nhân viên" },
                new Permission { Name = "edit_staff", Description = "Thêm, sửa, xóa nhân viên" },
                new Permission { Name = "access_reports", Description = "Truy cập báo cáo thống kê" },
                new Permission { Name = "manage_system", Description = "Quản lý hệ thống" }
            };

            foreach (Permission p in permissions)
            {
                context.Permissions.Add(p);
            }
            context.SaveChanges();

            // Thêm vai trò
            var roles = new Role[]
            {
                new Role { Name = "Administrator", Description = "Quản trị viên hệ thống, có toàn quyền" },
                new Role { Name = "Manager", Description = "Quản lý khách sạn, có quyền quản lý đặt phòng và nhân viên" },
                new Role { Name = "Receptionist", Description = "Lễ tân, có quyền quản lý đặt phòng và khách hàng" },
                new Role { Name = "Staff", Description = "Nhân viên thông thường, chỉ có quyền xem thông tin" }
            };

            foreach (Role r in roles)
            {
                context.Roles.Add(r);
            }
            context.SaveChanges();

            // Gán quyền cho vai trò
            // Administrator - tất cả quyền
            foreach (var permission in permissions)
            {
                context.RolePermissions.Add(new RolePermission
                {
                    RoleId = roles[0].Id,
                    PermissionId = permission.Id
                });
            }

            // Manager
            var managerPermissions = new string[] { "view_rooms", "edit_rooms", "view_bookings", "edit_bookings", "view_customers", "edit_customers", "view_invoices", "edit_invoices", "view_staff", "access_reports" };
            foreach (var permName in managerPermissions)
            {
                var perm = permissions.FirstOrDefault(p => p.Name == permName);
                if (perm != null)
                {
                    context.RolePermissions.Add(new RolePermission
                    {
                        RoleId = roles[1].Id,
                        PermissionId = perm.Id
                    });
                }
            }

            // Receptionist
            var receptionistPermissions = new string[] { "view_rooms", "view_bookings", "edit_bookings", "view_customers", "edit_customers", "view_invoices" };
            foreach (var permName in receptionistPermissions)
            {
                var perm = permissions.FirstOrDefault(p => p.Name == permName);
                if (perm != null)
                {
                    context.RolePermissions.Add(new RolePermission
                    {
                        RoleId = roles[2].Id,
                        PermissionId = perm.Id
                    });
                }
            }

            // Staff
            var staffPermissions = new string[] { "view_rooms", "view_bookings", "view_customers" };
            foreach (var permName in staffPermissions)
            {
                var perm = permissions.FirstOrDefault(p => p.Name == permName);
                if (perm != null)
                {
                    context.RolePermissions.Add(new RolePermission
                    {
                        RoleId = roles[3].Id,
                        PermissionId = perm.Id
                    });
                }
            }

            context.SaveChanges();

            // Thêm Admin
            string hashedPassword = HashPassword("admin123");
            var admin = new Admin
            {
                Username = "admin",
                Password = hashedPassword,
                Email = "admin@hotel.com",
                Role = "Administrator"
            };
            context.Admins.Add(admin);
            context.SaveChanges();

            // Gán vai trò cho admin
            context.AdminRoles.Add(new AdminRole
            {
                AdminId = admin.Id,
                RoleId = roles[0].Id // Administrator
            });
            context.SaveChanges();
        }

        private static string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
} 