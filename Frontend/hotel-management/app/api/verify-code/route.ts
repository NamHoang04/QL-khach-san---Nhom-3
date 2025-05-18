import { NextResponse } from 'next/server';
import { verifyCode } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    
    console.log(`API: Đang xác thực mã ${code} cho email ${email}`);

    if (!code) {
      console.log('API: Thiếu mã xác thực');
      return NextResponse.json(
        { error: 'Mã xác thực là bắt buộc' },
        { status: 400 }
      );
    }

    // Kiểm tra mã xác thực
    const isValid = verifyCode(email, code);
    console.log(`API: Kết quả xác thực: ${isValid ? 'Hợp lệ' : 'Không hợp lệ'}`);

    if (isValid) {
      return NextResponse.json({ 
        success: true,
        message: 'Mã xác thực hợp lệ',
        verifiedEmail: email
      });
    } else {
      return NextResponse.json(
        { error: 'Mã xác thực không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Lỗi khi xác thực mã:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xử lý yêu cầu' },
      { status: 500 }
    );
  }
} 