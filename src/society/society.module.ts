import { Module } from '@nestjs/common';
import { SocietyController } from './society.controller';
import { SocietyService } from './society.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SocietyController],
  providers: [SocietyService, PrismaService],
})
export class SocietyModule {}
