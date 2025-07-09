import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlatsService {
  constructor(private readonly prisma: PrismaService) {}

  getFlatsBySociety(societyId: number) {
    return this.prisma.flat.findMany({
      where: { societyId },
      select: {
        id: true,
        flatNumber: true,
        type: true,
        status: true,
      },
    });
  }
}
