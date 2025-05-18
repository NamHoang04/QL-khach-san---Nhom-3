-- Bảng tài khoản admin
CREATE TABLE admins (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin'
);

-- Bảng loại phòng
CREATE TABLE room_types (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    description TEXT,
    area INT, -- diện tích m2
    max_guests INT,
    amenities TEXT, -- tiện nghi (wifi, minibar, ...)
    image_url VARCHAR(255)
);

-- Bảng phòng
CREATE TABLE rooms (
    id INT IDENTITY(1,1) PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL UNIQUE,
    room_type_id INT NOT NULL,
    floor INT,
    price DECIMAL(15,2) NOT NULL,
    status VARCHAR(50), -- Sẵn sàng, Đang sử dụng, Bảo trì
    FOREIGN KEY (room_type_id) REFERENCES room_types(id)
);

-- Bảng khách hàng
CREATE TABLE customers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_code VARCHAR(10) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    identity_number VARCHAR(20), -- CCCD/CMND
    address VARCHAR(200),
    password VARCHAR(255) NOT NULL
);

-- Bảng đặt phòng
CREATE TABLE bookings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    booking_code VARCHAR(10) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(50), -- Đã xác nhận, Chờ xác nhận, Đã hủy
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Bảng hóa đơn
CREATE TABLE invoices (
    id INT IDENTITY(1,1) PRIMARY KEY,
    invoice_code VARCHAR(15) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    booking_id INT,
    created_at DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50), -- Đã thanh toán, Chờ thanh toán
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Bảng dịch vụ
CREATE TABLE services (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    description TEXT
);

-- Bảng sự kiện
CREATE TABLE events (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    start_time DATETIME,
    end_time DATETIME,
    event_date DATE,
    image_url VARCHAR(255)
);

-- Bảng nhân viên
CREATE TABLE staff (
    id INT IDENTITY(1,1) PRIMARY KEY,
    staff_code VARCHAR(10) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    position VARCHAR(50),
    status VARCHAR(50), -- Đang làm việc, Tạm nghỉ, Khóa
    avatar_url VARCHAR(255)
);

-- Bảng vai trò (roles)
CREATE TABLE roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- Bảng gán vai trò cho tài khoản admin (admin_roles)
CREATE TABLE admin_roles (
    admin_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (admin_id, role_id),
    FOREIGN KEY (admin_id) REFERENCES admins(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Bảng quyền (permissions)
CREATE TABLE permissions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- Bảng gán quyền cho vai trò (role_permissions)
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
); 