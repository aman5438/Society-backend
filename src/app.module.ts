import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FlatsModule } from './flats/flats.module';
import { SocietyController } from './society/society.controller';
import { SocietyService } from './society/society.service';
import { SocietyModule } from './society/society.module';
import { FlatsController } from './flats/flats.controller';
import { FlatsService } from './flats/flats.service';
import { SignupRequestController } from './signup-request/signup-request.controller';
import { SignupRequestService } from './signup-request/signup-request.service';
import { SignupRequestModule } from './signup-request/signup-request.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { OwnerModule } from './owner/owner.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    SocietyModule,
    FlatsModule,
    SignupRequestModule,
    AdminModule,
    OwnerModule,
  ],
  controllers: [
    AppController,
    SocietyController,
    FlatsController,
    SignupRequestController,
    AdminController,
  ],
  providers: [
    AppService,
    SocietyService,
    FlatsService,
    SignupRequestService,
    PrismaService,
    PrismaClient,
  ],
})
export class AppModule {}
