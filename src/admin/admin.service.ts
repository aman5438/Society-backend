import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, RequestStatus, UserStatus } from '@prisma/client';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { UpdateUserDto } from './dto/update-user.dto';

export enum Role {
  FLAT_OWNER = 'FLAT_OWNER',
  TENANT = 'TENANT',
}

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async getDashboardStats(adminId: number) {
    const assignments = await this.prisma.adminAssignment.findMany({
      where: { userId: adminId },
      select: { societyId: true, subSocietyId: true },
    });

    const societyIds = [
      ...new Set(
        assignments
          .map((a) => a.societyId)
          .filter((id): id is number => id !== null && id !== undefined),
      ),
    ];
    const subSocietyIds = [
      ...new Set(
        assignments
          .map((a) => a.subSocietyId)
          .filter((id): id is number => id !== null && id !== undefined),
      ),
    ];

    const orConditions: Prisma.FlatWhereInput[] = [];

    if (societyIds.length) {
      orConditions.push({ societyId: { in: societyIds } });
    }
    if (subSocietyIds.length) {
      orConditions.push({ subSocietyId: { in: subSocietyIds } });
    }

    if (societyIds.length === 0 && subSocietyIds.length === 0) {
      return {
        signupRequests: 0,
        flats: 0,
        societies: 0,
        nocRequests: 0,
      };
    }

    const [signupRequests, flats, societies, nocRequests] = await Promise.all([
      this.prisma.signupRequest.count({
        where: {
          status: 'PENDING',
        },
      }),

      this.prisma.flat.count({
        where: {
          OR: orConditions.length ? orConditions : undefined,
        },
      }),

      this.prisma.society.count({
        where: { id: { in: societyIds } },
      }),

      this.prisma.nOCRequest.count({
        where: {
          status: 'PENDING',
          societyId: { in: societyIds },
        },
      }),
    ]);

    return {
      signupRequests,
      flats,
      societies,
      nocRequests,
    };
  }

  async getPendingSignupRequests() {
    return this.prisma.signupRequest.findMany({
      where: { status: RequestStatus.PENDING },
      include: {
        user: true,
        society: true,
      },
    });
  }

  async updateSignupStatus(id: number, status: RequestStatus) {
    const request = await this.prisma.signupRequest.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!request) throw new NotFoundException('Signup request not found');

    await this.prisma.signupRequest.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === 'REJECTED' ? 'Rejected by admin' : null,
      },
    });

    await this.prisma.user.update({
      where: { id: request.userId },
      data: {
        status: status === 'APPROVED' ? UserStatus.ACTIVE : UserStatus.REJECTED,
      },
    });

    if (status === 'APPROVED') {
      const flat = await this.prisma.flat.findFirst({
        where: {
          id: Number(request.flatNumber),
          societyId: request.societyId,
        },
      });

      if (flat) {
        const updateData: Prisma.FlatUpdateInput = {
          status: 'OCCUPIED',
        };

        if (request.role === Role.FLAT_OWNER) {
          updateData.owner = { connect: { id: request.userId } };
        } else if (request.role === Role.TENANT) {
          updateData.tenant = { connect: { id: request.userId } };
        }

        await this.prisma.flat.update({
          where: { id: flat.id },
          data: updateData,
        });
      }

      await this.mailerService.sendTemplate(
        request.user.email,
        'Signup Approved',
        'approval',
        {
          name: request.user.name,
          loginUrl: `${process.env.SOCIETY_FRONTEND_URL}/login`,
        },
      );
    }

    if (status === 'REJECTED') {
      await this.mailerService.sendTemplate(
        request.user.email,
        'Signup Rejected',
        'rejection',
        {
          name: request.user.name,
          reason: 'Your signup request was rejected by the admin.',
        },
      );
    }

    await this.prisma.auditLog.create({
      data: {
        userId: request.userId,
        action: status === 'APPROVED' ? 'APPROVE_SIGNUP' : 'REJECT_SIGNUP',
        entityId: id,
        entityType: 'SignupRequest',
        details: {
          reason:
            status === 'REJECTED'
              ? 'Rejected by admin'
              : 'Approved successfully',
        },
      },
    });

    return { message: `Signup request ${status.toLowerCase()}` };
  }

  async getAllFlats(adminId: number) {
    const assignments = await this.prisma.adminAssignment.findMany({
      where: { userId: adminId },
      select: {
        societyId: true,
        subSocietyId: true,
      },
    });

    const societyIds = assignments
      .map((a) => a.societyId)
      .filter((id): id is number => id !== null && id !== undefined);
    const subSocietyIds = assignments
      .map((a) => a.subSocietyId)
      .filter((id): id is number => id !== null && id !== undefined);

    return this.prisma.flat.findMany({
      where: {
        OR: [
          { societyId: { in: societyIds } },
          { subSocietyId: { in: subSocietyIds } },
        ],
      },
      include: {
        society: {
          select: { name: true, societyCode: true },
        },
        owner: {
          select: { name: true, email: true },
        },
        tenant: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async getAssignedSocieties(adminId: number) {
    const assignments = await this.prisma.adminAssignment.findMany({
      where: { userId: adminId },
      select: { societyId: true },
    });

    const societyIds = [
      ...new Set(
        assignments
          .map((a) => a.societyId)
          .filter((id): id is number => id !== null && id !== undefined),
      ),
    ];

    if (!societyIds.length) return [];

    return this.prisma.society.findMany({
      where: {
        id: { in: societyIds },
      },
      select: {
        id: true,
        name: true,
        societyCode: true,
        subSocieties: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async updateFlat(id: number, data: UpdateFlatDto) {
    try {
      const flat = await this.prisma.flat.update({
        where: { id: Number(id) },
        data: {
          type: data.type,
          status: data.status as 'VACANT' | 'OCCUPIED',
        },
      });
      return flat;
    } catch {
      return null;
    }
  }

  async updateUser(id: number, data: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id: Number(id) },
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role as 'FLAT_OWNER' | 'TENANT',
        },
      });
      return user;
    } catch {
      return null;
    }
  }

  async deleteFlat(id: number) {
    try {
      await this.prisma.flat.delete({
        where: { id: Number(id) },
      });
      return true;
    } catch {
      return false;
    }
  }

  async getById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
      },
    });
  }
}
