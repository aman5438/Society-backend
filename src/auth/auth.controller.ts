import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
// import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FilesInterceptor('document'))
  async signup(
    @Body() body: SignupDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.authService.signup(body, files);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials or access denied');
    }
    return result;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const { email } = body;
    if (!email) {
      throw new UnauthorizedException('Email is required');
    }
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;
    if (!token || !newPassword) {
      throw new UnauthorizedException('Token and new password are required');
    }
    return this.authService.resetPassword(token, newPassword);
  }
}
