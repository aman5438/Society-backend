import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocietyService {
  constructor(private prisma: PrismaService) {}

  async getSocieties() {
    return this.prisma.society.findMany({
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
}
