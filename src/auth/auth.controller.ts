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
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseInterceptors(FilesInterceptor('document'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Signup payload with documents',
    type: SignupDto,
  })

  @Post('signup')
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
  async resetPassword(@Body() body: ResetPasswordDto) {
    if (!body || !body.token || !body.newPassword) {
      throw new UnauthorizedException('Token and new password are required');
    }
    const { token, newPassword } = body;
    if (!token || !newPassword) {
      throw new UnauthorizedException('Token and new password are required');
    }
    return this.authService.resetPassword(token, newPassword);
  }
}

