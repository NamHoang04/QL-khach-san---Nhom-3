using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<AdminRole> AdminRoles { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Staff> Staffs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Ánh xạ tên bảng
            modelBuilder.Entity<Admin>().ToTable("admins");
            modelBuilder.Entity<Role>().ToTable("roles");
            modelBuilder.Entity<Permission>().ToTable("permissions");
            modelBuilder.Entity<AdminRole>().ToTable("admin_roles");
            modelBuilder.Entity<RolePermission>().ToTable("role_permissions");
            modelBuilder.Entity<RoomType>().ToTable("room_types");
            modelBuilder.Entity<Room>().ToTable("rooms");
            modelBuilder.Entity<Customer>().ToTable("customers");
            modelBuilder.Entity<Booking>().ToTable("bookings");
            modelBuilder.Entity<Invoice>().ToTable("invoices");
            modelBuilder.Entity<Service>().ToTable("services");
            modelBuilder.Entity<Event>().ToTable("events");
            modelBuilder.Entity<Staff>().ToTable("staff");

            // Configure composite keys
            modelBuilder.Entity<AdminRole>()
                .HasKey(ar => new { ar.AdminId, ar.RoleId });

            modelBuilder.Entity<RolePermission>()
                .HasKey(rp => new { rp.RoleId, rp.PermissionId });

            // Configure relationships
            modelBuilder.Entity<AdminRole>()
                .HasOne(ar => ar.Admin)
                .WithMany(a => a.AdminRoles)
                .HasForeignKey(ar => ar.AdminId);

            modelBuilder.Entity<AdminRole>()
                .HasOne(ar => ar.Role)
                .WithMany(r => r.AdminRoles)
                .HasForeignKey(ar => ar.RoleId);

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId);

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId);

            base.OnModelCreating(modelBuilder);
        }
    }
} 