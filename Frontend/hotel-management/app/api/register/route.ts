import { NextResponse } from 'next/server';

interface RegisterData {
  username: string;
  email: string;
  phone: string;
  cccd: string;
  address: string;
  password: string;
}

// Danh sách username đã tồn tại (mẫu - cần thay thế bằng truy vấn DB thực tế)
const existingUsernames = ["admin", "NamHoang04", "user1", "test123", "manager"];
// Danh sách email đã tồn tại (mẫu - cần thay thế bằng truy vấn DB thực tế)
const existingEmails = ["admin@example.com", "nam.vuonghoang04@gmail.com", "test@test.com"];
// Danh sách CCCD đã tồn tại (mẫu - cần thay thế bằng truy vấn DB thực tế)
const existingCCCDs = ["123456789012", "123456789"];

export async function POST(request: Request) {
  try {
    const data: RegisterData = await request.json();
    const { username, email, phone, cccd, address, password } = data;

    // Kiểm tra các trường bắt buộc
    const fieldErrors: Record<string, string> = {};
    if (!username) fieldErrors.username = "Không được bỏ trống";
    if (!email) fieldErrors.email = "Không được bỏ trống";
    if (!phone) fieldErrors.phone = "Không được bỏ trống"; 
    if (!cccd) fieldErrors.cccd = "Không được bỏ trống";
    if (!address) fieldErrors.address = "Không được bỏ trống";
    if (!password) fieldErrors.password = "Không được bỏ trống";

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đầy đủ thông tin", fieldErrors },
        { status: 400 }
      );
    }

    // Kiểm tra username đã tồn tại chưa
    if (existingUsernames.includes(username)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Tên đăng nhập đã tồn tại", 
          fieldErrors: { username: "Tên đăng nhập đã tồn tại" } 
        },
        { status: 400 }
      );
    }

    // Kiểm tra email đã tồn tại chưa
    if (existingEmails.includes(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Email đã được sử dụng", 
          fieldErrors: { email: "Email đã được sử dụng" } 
        },
        { status: 400 }
      );
    }

    // Kiểm tra CCCD đã tồn tại chưa
    if (existingCCCDs.includes(cccd)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "CCCD/CMND đã được sử dụng", 
          fieldErrors: { cccd: "CCCD/CMND đã được sử dụng" } 
        },
        { status: 400 }
      );
    }

    // Trong thực tế, đây là nơi bạn sẽ tạo người dùng mới trong cơ sở dữ liệu
    console.log("Đăng ký người dùng mới:", { username, email, phone, cccd, address });
    
    // Mô phỏng quá trình tạo người dùng mới
    // Trong thực tế, bạn sẽ lưu thông tin người dùng vào cơ sở dữ liệu
    // và mã hóa mật khẩu trước khi lưu
    const newUser = {
      id: Math.floor(Math.random() * 1000),
      username,
      email,
      phone,
      cccd,
      address,
      createdAt: new Date().toISOString()
    };

    // Thêm vào danh sách mẫu (chỉ cho demo)
    existingUsernames.push(username);
    existingEmails.push(email);
    existingCCCDs.push(cccd);

    return NextResponse.json({ 
      success: true, 
      message: "Đăng ký thành công",
      user: newUser
    });
  } catch (error) {
    console.error('Lỗi khi đăng ký người dùng:', error);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi khi xử lý yêu cầu' },
      { status: 500 }
    );
  }
} 