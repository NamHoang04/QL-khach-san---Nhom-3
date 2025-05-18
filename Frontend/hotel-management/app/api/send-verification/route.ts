import { NextResponse } from 'next/server';
import { generateVerificationCode, sendVerificationCode } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // Tạo mã xác thực 6 chữ số
    const code = generateVerificationCode();
    console.log(`API: Đã tạo mã xác thực cho email ${email}`);

    // Gửi mã xác thực qua email
    const success = await sendVerificationCode({ email, code });
    console.log(`API: Kết quả gửi email: ${success ? 'Thành công' : 'Thất bại'}`);

    if (success) {
      return NextResponse.json({ 
        success: true,
        message: 'Mã xác thực đã được gửi'
      });
    } else {
      return NextResponse.json(
        { error: 'Không thể gửi mã xác thực' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Lỗi khi gửi mã xác thực:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xử lý yêu cầu' },
      { status: 500 }
    );
  }
} 