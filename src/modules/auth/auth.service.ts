import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { mailService } from 'src/lib/mail.service';
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh-token.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { UserService } from 'src/modules/user/user.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  generateVerificationCode(): { code: string; expiresAt: Date } {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);
    return { code, expiresAt };
  }

  async register(userData: RegisterDto): Promise<any> {
    const existingUser = await this.prismaService.users.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new HttpException(
        { message: 'Email đã được sử dụng' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await hash(userData.password, 10);
    const defaultRole = await this.prismaService.roles.findUnique({
      where: { RoleName: 'USER' },
    });

    if (!defaultRole) {
      throw new HttpException(
        { message: 'Không tìm thấy vai trò mặc định' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.prismaService.users.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        fullname: userData.fullname,
        Role: {
          connect: { RoleID: defaultRole.RoleID },
        },
      },
    });

    return { message: 'Đăng ký thành công' };
  }

  login = async (data: { email: string; password: string }): Promise<any> => {
    const user = await this.prismaService.users.findUnique({
      where: {
        email: data.email,
      },
      include: {
        Role: true,
      },
    });

    if (!user) {
      throw new HttpException(
        { message: 'Account not found' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const verify = await compare(data.password, user.password);
    if (!verify) {
      throw new HttpException(
        { message: 'Password is not correct' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.Role) {
      throw new HttpException(
        { message: 'User role not assigned' },
        HttpStatus.FORBIDDEN,
      );
    }

    const payload = {
      id: user.UserID,
      name: user.fullname,
      email: user.email,
      role: user.Role.RoleName,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: '1d',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.UserID,
        name: user.fullname,
        email: user.email,
        role: user.Role.RoleName,
      },
    };
  };

  createToken = async (id: string): Promise<string> => {
    if (!process.env.ACCESS_TOKEN_KEY) {
      throw new Error(
        'Access token secret key not found in environment variables.',
      );
    }

    return this.jwtService.sign(
      { id },
      {
        expiresIn: '7d',
        secret: process.env.ACCESS_TOKEN_KEY,
      },
    );
  };

  forgotPassword = async (data: { email: string }) => {
    const user = await this.prismaService.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new HttpException(
        { message: `Email ${data.email} not found` },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const access_token = await this.createToken(user.UserID.toString());

    const templateEmailResetPassword = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Đặt lại mật khẩu</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 10px 0;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 20px;
          font-size: 16px;
          color: #333333;
          line-height: 1.6;
        }
        .btn {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777777;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Đặt lại mật khẩu của bạn</h2>
        </div>
        <div class="content">
          <p>Xin chào,</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu của bạn. Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
          <p>Nếu bạn muốn tiếp tục đặt lại mật khẩu, vui lòng nhấn vào nút dưới đây:</p>
          <a href="http://localhost:3000/reset-password?access_token=${access_token}" class="btn">Đặt lại mật khẩu</a>
          <p>Liên kết đặt lại mật khẩu này sẽ hết hạn sau 24 giờ.</p>
        </div>
        <div class="footer">
          <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
        </div>
      </div>
    </body>
    </html>
`;

    await mailService.sendMail({
      to: data.email,
      html: templateEmailResetPassword,
      subject: 'Reset  password',
    });

    return {
      message:
        'Your password has been reset successfully. Please login with your new password.',
    };
  };
  resetPassword = async (data: Users, newPassword: string) => {
    const user = await this.prismaService.users.findUnique({
      where: { UserID: data.UserID },
      select: {
        password: true,
      },
    });

    if (!user || !user.password) {
      throw new HttpException(
        { message: 'User password is missing' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const isSamePassword = await compare(newPassword, user.password);
    if (isSamePassword) {
      throw new HttpException(
        { message: 'New password cannot be the same as the old password' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await hash(newPassword, 10);

    await this.prismaService.users.update({
      where: {
        UserID: data.UserID,
      },
      data: {
        password: hashPassword,
      },
    });

    return { message: 'Password reset successfully' };
  };

  async validateToken(token: string): Promise<{ userId: string }> {
    try {
      const decoded = this.jwtService.verify(token);
      return { userId: decoded.sub };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async changePassword(
    user: Users,
    current_password: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<any> {
    const userRecord = await this.prismaService.users.findUnique({
      where: { UserID: user.UserID },
      select: {
        password: true,
      },
    });

    if (!userRecord || !userRecord.password) {
      throw new HttpException(
        { message: 'User password is missing' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isCurrentPasswordCorrect = await compare(
      current_password,
      userRecord.password,
    );
    if (!isCurrentPasswordCorrect) {
      throw new HttpException(
        { message: 'Current password is incorrect' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (current_password === newPassword) {
      throw new HttpException(
        { message: 'New password cannot be the same as the current password' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (newPassword !== confirmPassword) {
      throw new HttpException(
        { message: 'New password and confirm password do not match' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await hash(newPassword, 10);
    await this.prismaService.users.update({
      where: {
        UserID: user.UserID,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Password changed successfully' };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refresh_token } = refreshTokenDto;

    const userId = await this.validateRefreshToken(refresh_token);
    if (!userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.getDetail(userId);
    const newAccessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return { access_token: newAccessToken };
  }

  private async validateRefreshToken(token: string): Promise<string | null> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded.userId;
    } catch (error) {
      return null;
    }
  }
}
