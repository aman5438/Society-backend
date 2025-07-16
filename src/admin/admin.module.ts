import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
  imports: [MailerModule],
})
export class AdminModule {}
