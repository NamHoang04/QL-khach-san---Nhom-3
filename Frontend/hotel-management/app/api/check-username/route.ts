import { NextResponse } from 'next/server';

// Danh sách username đã tồn tại (mẫu - cần thay thế bằng truy vấn DB thực tế)
const existingUsernames = ["admin", "NamHoang04", "user1", "test123", "manager"];

export async function GET(request: Request) {
  try {
    // Lấy username từ query param
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username không được cung cấp' },
        { status: 400 }
      );
    }

    // Kiểm tra username có tồn tại trong danh sách mẫu không
    // Trong thực tế, đây sẽ là truy vấn đến cơ sở dữ liệu
    const exists = existingUsernames.includes(username);

    return NextResponse.json({ exists });
  } catch (error) {
    console.error('Lỗi khi kiểm tra username:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xử lý yêu cầu' },
      { status: 500 }
    );
  }
} 