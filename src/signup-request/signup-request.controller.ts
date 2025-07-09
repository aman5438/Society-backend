import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { SignupRequestService } from './signup-request.service';
import { UpdateSignupRequestDto } from './dto/update-signup-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/admin/signup-requests')
@UseGuards(JwtAuthGuard)
export class SignupRequestController {
  constructor(private readonly signupRequestService: SignupRequestService) {}

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateSignupRequestDto) {
    return this.signupRequestService.updateStatus(+id, dto);
  }
}
