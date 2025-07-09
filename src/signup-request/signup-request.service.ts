import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateSignupRequestDto } from './dto/update-signup-request.dto';

@Injectable()
export class SignupRequestService {
  constructor(private prisma: PrismaService) {}

  async updateStatus(id: number, dto: UpdateSignupRequestDto) {
    const signupRequest = await this.prisma.signupRequest.findUnique({
      where: { id },
    });

    if (!signupRequest) throw new NotFoundException('Signup request not found');

    await this.prisma.signupRequest.update({
      where: { id },
      data: {
        status: dto.status,
        rejectionReason: dto.rejectionReason || null,
      },
    });
    return { message: 'Signup request updated successfully' };
  }
}
