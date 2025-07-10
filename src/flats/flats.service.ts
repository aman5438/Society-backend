import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFlatsBySociety(societyId: number) {
    const requestedFlats = await this.prisma.signupRequest.findMany({
      where: {
        societyId,
      },
      select: {
        flatNumber: true,
      },
    });

    const requestedFlatIds = requestedFlats
      .map((r) => parseInt(r.flatNumber))
      .filter((id) => !isNaN(id));

    return this.prisma.flat.findMany({
      where: {
        societyId,
        id: {
          notIn: requestedFlatIds,
        },
      },
      select: {
        id: true,
        flatNumber: true,
        type: true,
        status: true,
      },
    });
  }
}
