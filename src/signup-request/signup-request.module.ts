// src/signup-request/signup-request.module.ts
import { Module } from '@nestjs/common';
import { SignupRequestController } from './signup-request.controller';
import { SignupRequestService } from './signup-request.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SignupRequestController],
  providers: [SignupRequestService, PrismaService],
})
export class SignupRequestModule {}
