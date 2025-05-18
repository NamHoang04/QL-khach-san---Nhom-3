import nodemailer from 'nodemailer';

// Tạo một transporter cho môi trường development
// Sử dụng một tài khoản Ethereal để test email mà không cần cấu hình thật
let testAccount: any = null;
let devTransporter: nodemailer.Transporter | null = null;

// Tạo một transporter để gửi email trong môi trường production
// Chú ý: Trong môi trường sản xuất thực tế, bạn nên sử dụng biến môi trường để lưu trữ thông tin đăng nhập
const prodTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',  // thay đổi tùy theo dịch vụ email của bạn
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'nam.vuonghoang04@gmail.com', // email đã cấu hình
    pass: process.env.EMAIL_PASSWORD || 'app-password-here', // thay bằng mật khẩu ứng dụng từ Google (https://myaccount.google.com/apppasswords)
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Khởi tạo transporter cho development
async function createDevTransporter() {
  if (devTransporter) return devTransporter;
  
  try {
    // Tạo tài khoản test Ethereal nếu chưa có
    if (!testAccount) {
      testAccount = await nodemailer.createTestAccount();
      console.log('Đã tạo tài khoản test Ethereal:', testAccount.user);
    }
    
    // Tạo transporter với tài khoản test
    devTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    return devTransporter;
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản test:', error);
    throw error;
  }
}

interface SendVerificationCodeParams {
  email: string;
  code: string;
}

// Hàm gửi email với mã xác thực
export async function sendVerificationCode({ email, code }: SendVerificationCodeParams): Promise<boolean> {
  try {
    // Lưu mã xác thực trước để đảm bảo nó được lưu ngay cả khi gửi email thất bại
    storeVerificationCode(email, code);
    
    // Nội dung email
    const mailOptions = {
      from: '"Hotel Management System" <no-reply@hotelmanagement.com>',
      to: email,
      subject: 'Mã xác thực đặt lại mật khẩu',
      text: `Mã xác thực của bạn là: ${code}. Mã này sẽ hết hạn sau 5 phút.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e40af; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Hotel Management System</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <p>Xin chào,</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng sử dụng mã xác thực sau để hoàn tất quá trình:</p>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
              ${code}
            </div>
            <p>Mã này sẽ hết hạn sau 5 phút.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi nếu bạn có thắc mắc.</p>
            <p>Trân trọng,<br>Hotel Management Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      `
    };

    // Trong môi trường development, sử dụng Ethereal để test
    const transporter = await createDevTransporter();
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`Email được gửi tới: ${email}`);
    console.log(`Mã xác thực: ${code}`);
    
    // Ethereal cung cấp URL để xem email đã gửi
    console.log('Xem email tại:', nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    // Trong môi trường phát triển, cho phép tiếp tục mặc dù có lỗi
    // vì mã đã được lưu trữ ở trên
    return true;
  }
}

// Lưu mã xác thực vào cache để kiểm tra sau này
interface VerificationCodeRecord {
  code: string;
  expiresAt: number; // Timestamp thời điểm hết hạn
}

const verificationCodes: Record<string, VerificationCodeRecord> = {};

// Lưu mã xác thực với thời gian hết hạn 5 phút
export function storeVerificationCode(email: string, code: string): void {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 phút tính từ thời điểm hiện tại
  verificationCodes[email] = { code, expiresAt };
  console.log(`Đã lưu mã ${code} cho email ${email}, hết hạn sau 5 phút`);
}

// Kiểm tra mã xác thực có hợp lệ không
export function verifyCode(email: string, code: string): boolean {
  const record = verificationCodes[email];
  
  if (!record) {
    console.log(`Không tìm thấy mã xác thực cho email ${email}`);
    return false; // Không tìm thấy mã xác thực cho email này
  }
  
  if (Date.now() > record.expiresAt) {
    console.log(`Mã xác thực cho email ${email} đã hết hạn`);
    delete verificationCodes[email]; // Xóa mã đã hết hạn
    return false; // Mã đã hết hạn
  }
  
  if (record.code !== code) {
    console.log(`Mã xác thực không khớp cho email ${email}. Expected: ${record.code}, Got: ${code}`);
    return false; // Mã không khớp
  }
  
  // Xác thực thành công, xóa mã đã sử dụng
  console.log(`Xác thực thành công cho email ${email}`);
  delete verificationCodes[email];
  return true;
}

// Tạo mã xác thực ngẫu nhiên 6 chữ số
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
} 