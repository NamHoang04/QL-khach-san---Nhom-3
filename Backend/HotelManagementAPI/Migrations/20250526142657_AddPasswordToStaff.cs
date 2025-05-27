using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddPasswordToStaff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "password",
                table: "staff",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "category",
                table: "services",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "icon",
                table: "services",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "discount_percent",
                table: "rooms",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_featured",
                table: "rooms",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "original_price",
                table: "rooms",
                type: "decimal(15,2)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "rating",
                table: "rooms",
                type: "float",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "check_out",
                table: "bookings",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "date");

            migrationBuilder.AlterColumn<DateTime>(
                name: "check_in",
                table: "bookings",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "date");

            migrationBuilder.AlterColumn<string>(
                name: "booking_code",
                table: "bookings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(10)",
                oldMaxLength: 10);

            migrationBuilder.AddColumn<string>(
                name: "full_name",
                table: "admins",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "booking_services",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    booking_id = table.Column<int>(type: "int", nullable: false),
                    service_id = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    price = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    note = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_booking_services", x => x.id);
                    table.ForeignKey(
                        name: "FK_booking_services_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_booking_services_services_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "favorite_rooms",
                columns: table => new
                {
                    customer_id = table.Column<int>(type: "int", nullable: false),
                    room_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_favorite_rooms", x => new { x.customer_id, x.room_id });
                    table.ForeignKey(
                        name: "FK_favorite_rooms_customers_customer_id",
                        column: x => x.customer_id,
                        principalTable: "customers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_favorite_rooms_rooms_room_id",
                        column: x => x.room_id,
                        principalTable: "rooms",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "favorite_services",
                columns: table => new
                {
                    customer_id = table.Column<int>(type: "int", nullable: false),
                    service_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_favorite_services", x => new { x.customer_id, x.service_id });
                    table.ForeignKey(
                        name: "FK_favorite_services_customers_customer_id",
                        column: x => x.customer_id,
                        principalTable: "customers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_favorite_services_services_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_booking_services_booking_id",
                table: "booking_services",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "IX_booking_services_service_id",
                table: "booking_services",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_favorite_rooms_room_id",
                table: "favorite_rooms",
                column: "room_id");

            migrationBuilder.CreateIndex(
                name: "IX_favorite_services_service_id",
                table: "favorite_services",
                column: "service_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "booking_services");

            migrationBuilder.DropTable(
                name: "favorite_rooms");

            migrationBuilder.DropTable(
                name: "favorite_services");

            migrationBuilder.DropColumn(
                name: "password",
                table: "staff");

            migrationBuilder.DropColumn(
                name: "category",
                table: "services");

            migrationBuilder.DropColumn(
                name: "icon",
                table: "services");

            migrationBuilder.DropColumn(
                name: "discount_percent",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "is_featured",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "original_price",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "rating",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "full_name",
                table: "admins");

            migrationBuilder.AlterColumn<DateTime>(
                name: "check_out",
                table: "bookings",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "check_in",
                table: "bookings",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "booking_code",
                table: "bookings",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);
        }
    }
}
