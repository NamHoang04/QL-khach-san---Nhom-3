-- Bảng tài khoản Admin
CREATE TABLE Admins (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    email NVARCHAR(100),
    role NVARCHAR(20) DEFAULT 'Admin'
);

-- Bảng loại phòng
CREATE TABLE room_types (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    description NTEXT,
    area INT, -- diện tích m2
    max_guests INT,
    amenities NTEXT, -- tiện nghi (wifi, minibar, ...)
    image_url NVARCHAR(255)
);

-- Bảng phòng
CREATE TABLE rooms (
    id INT IDENTITY(1,1) PRIMARY KEY,
    room_number NVARCHAR(10) NOT NULL UNIQUE,
    room_type_id INT NOT NULL,
    floor INT,
    price DECIMAL(15,2) NOT NULL,
    status NVARCHAR(50), -- Sẵn sàng, Đang sử dụng, Bảo trì
    FOREIGN KEY (room_type_id) REFERENCES room_types(id)
);

-- Bảng khách hàng
CREATE TABLE Customers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    Customer_code NVARCHAR(10) NOT NULL UNIQUE,
    full_name NVARCHAR(100) NOT NULL,
    UserName NVARCHAR(100) NOT NULL,
    email NVARCHAR(100),
    phone NVARCHAR(20),
    identity_number NVARCHAR(20), -- CCCD/CMND
    address NVARCHAR(200),
    password NVARCHAR(255) NOT NULL
);

-- Bảng đặt phòng
CREATE TABLE bookings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    booking_code NVARCHAR(10) NOT NULL UNIQUE,
    Customer_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status NVARCHAR(50), -- Đã xác nhận, Chờ xác nhận, Đã hủy
    FOREIGN KEY (Customer_id) REFERENCES Customers(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Bảng hóa đơn
CREATE TABLE invoices (
    id INT IDENTITY(1,1) PRIMARY KEY,
    invoice_code NVARCHAR(15) NOT NULL UNIQUE,
    Customer_id INT NOT NULL,
    booking_id INT,
    created_at DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    status NVARCHAR(50), -- Đã thanh toán, Chờ thanh toán
    FOREIGN KEY (Customer_id) REFERENCES Customers(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Bảng dịch vụ
CREATE TABLE services (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    description NTEXT
);

-- Bảng sự kiện
CREATE TABLE events (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NTEXT,
    location NVARCHAR(100),
    start_time DATETIME,
    end_time DATETIME,
    event_date DATE,
    image_url NVARCHAR(255)
);

-- Bảng nhân viên
CREATE TABLE Staff (
    id INT IDENTITY(1,1) PRIMARY KEY,
    Staff_code NVARCHAR(10) NOT NULL UNIQUE,
    UserName NVARCHAR(100) NOT NULL,
    email NVARCHAR(100),
    phone NVARCHAR(20),
    position NVARCHAR(50),
    status NVARCHAR(50), -- Đang làm việc, Tạm nghỉ, Khóa
    avatar_url NVARCHAR(255)
);

-- Bảng vai trò (roles)
CREATE TABLE roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255)
);

-- Bảng gán vai trò cho tài khoản Admin (Admin_roles)
CREATE TABLE Admin_roles (
    Admin_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (Admin_id, role_id),
    FOREIGN KEY (Admin_id) REFERENCES Admins(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Bảng quyền (permissions)
CREATE TABLE permissions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255)
);

-- Bảng gán quyền cho vai trò (role_permissions)
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
); 