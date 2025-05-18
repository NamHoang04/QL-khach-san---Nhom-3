# Quản Lý Khách Sạn - Nhóm 3

## Cấu Trúc Dự Án
- `NewBackend/`: Chứa mã nguồn API backend .NET Core
- `QL-khach-san---Nhom-3/hotel-management/`: Chứa mã nguồn frontend Next.js

## Hướng Dẫn Kết Nối Frontend với Backend

### Chạy Backend API
1. Mở dự án backend trong Visual Studio hoặc Visual Studio Code:
   ```
   cd NewBackend
   ```

2. Khôi phục các gói NuGet:
   ```
   dotnet restore
   ```

3. Chạy dự án API:
   ```
   dotnet run --project HotelManagementAPI
   ```
   Hoặc trong Visual Studio, nhấn F5 để chạy với chế độ debug.

4. API sẽ chạy mặc định tại URLs:
   - https://localhost:5001
   - http://localhost:5000

### Cấu Hình Frontend
1. Cập nhật URL API trong file cấu hình:
   Mở file `QL-khach-san---Nhom-3/hotel-management/lib/config.ts` và kiểm tra URL API:
   ```typescript
   export const API_CONFIG = {
     baseUrl: 'https://localhost:5001/api', // Hoặc port tương ứng của API
     // ...
   };
   ```

2. Cài đặt các gói npm cần thiết:
   ```
   cd QL-khach-san---Nhom-3/hotel-management
   npm install
   ```

3. Chạy ứng dụng frontend:
   ```
   npm run dev
   ```

4. Truy cập ứng dụng tại địa chỉ: http://localhost:3000

### Các Services API Đã Tạo
Dự án đã bao gồm các services sau để kết nối với API backend:

1. `api-service.ts`: Service cơ sở để gọi API
2. `auth-service.ts`: Xử lý xác thực và đăng nhập
3. `booking-service.ts`: Quản lý đặt phòng
4. `room-service.ts`: Quản lý phòng và loại phòng
5. `customer-service.ts`: Quản lý thông tin khách hàng
6. `invoice-service.ts`: Quản lý hóa đơn
7. `service-service.ts`: Quản lý dịch vụ khách sạn

### Sử Dụng Mock Data (nếu cần)
Nếu API backend chưa sẵn sàng, bạn có thể sử dụng dữ liệu mẫu bằng cách:
1. Mở file `QL-khach-san---Nhom-3/hotel-management/lib/config.ts`
2. Thay đổi `useMockData: false` thành `useMockData: true`

## Các API Endpoint
API backend cung cấp các endpoint sau:

1. Phòng:
   - GET /api/rooms - Lấy tất cả phòng
   - GET /api/rooms/{id} - Lấy phòng theo ID
   - POST /api/rooms - Tạo phòng mới
   - PUT /api/rooms/{id} - Cập nhật phòng
   - DELETE /api/rooms/{id} - Xóa phòng

2. Loại Phòng:
   - GET /api/roomtypes - Lấy tất cả loại phòng
   - GET /api/roomtypes/{id} - Lấy loại phòng theo ID
   - POST /api/roomtypes - Tạo loại phòng mới
   - PUT /api/roomtypes/{id} - Cập nhật loại phòng
   - DELETE /api/roomtypes/{id} - Xóa loại phòng

3. Đặt Phòng:
   - GET /api/bookings - Lấy tất cả đặt phòng
   - GET /api/bookings/{id} - Lấy đặt phòng theo ID
   - POST /api/bookings - Tạo đặt phòng mới
   - PUT /api/bookings/{id} - Cập nhật đặt phòng
   - DELETE /api/bookings/{id} - Xóa đặt phòng

4. Khách Hàng:
   - GET /api/customers - Lấy tất cả khách hàng
   - GET /api/customers/{id} - Lấy khách hàng theo ID
   - POST /api/customers - Tạo khách hàng mới
   - PUT /api/customers/{id} - Cập nhật khách hàng
   - DELETE /api/customers/{id} - Xóa khách hàng

5. Hóa Đơn:
   - GET /api/invoices - Lấy tất cả hóa đơn
   - GET /api/invoices/{id} - Lấy hóa đơn theo ID
   - POST /api/invoices - Tạo hóa đơn mới
   - PUT /api/invoices/{id} - Cập nhật hóa đơn
   - DELETE /api/invoices/{id} - Xóa hóa đơn

6. Dịch Vụ:
   - GET /api/services - Lấy tất cả dịch vụ
   - GET /api/services/{id} - Lấy dịch vụ theo ID
   - POST /api/services - Tạo dịch vụ mới
   - PUT /api/services/{id} - Cập nhật dịch vụ
   - DELETE /api/services/{id} - Xóa dịch vụ

## Xử Lý Lỗi
Nếu gặp lỗi khi kết nối API:
1. Kiểm tra backend API đã chạy chưa
2. Kiểm tra URL API trong file config.ts đã đúng chưa
3. Kiểm tra CORS đã được cấu hình đúng trên backend
4. Kiểm tra console trong DevTools của trình duyệt để xem thông báo lỗi 