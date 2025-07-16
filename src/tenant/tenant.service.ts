import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestStatus, FlatStatus, Role } from '@prisma/client';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== Role.TENANT) {
      throw new ForbiddenException('Access denied');
    }

    const signupRequest = await this.prisma.signupRequest.findFirst({
      where: { userId, status: RequestStatus.APPROVED },
    });
    if (!signupRequest) {
      return { message: 'Your signup request is still pending or rejected.' };
    }

    const flat = await this.prisma.flat.findFirst({
      where: { tenantId: userId, status: FlatStatus.OCCUPIED },
      include: {
        society: true,
        subSociety: true,
      },
    });

    if (!flat) {
      return { message: 'No assigned flat found or flat is not yet occupied.' };
    }
    return {
      isApproved: signupRequest,
      isOccupied: flat?.status === 'OCCUPIED',
      flat: flat,
      tenant_user: user,
    };
  }
}
