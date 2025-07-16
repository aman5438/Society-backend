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
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { OwnerModule } from './owner/owner.module';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';
import { TenantModule } from './tenant/tenant.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { MailerService } from './mailer/mailer.service';
import { AdminService } from './admin/admin.service';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule,
    PrismaModule,
    AuthModule,
    SocietyModule,
    FlatsModule,
    AdminModule,
    OwnerModule,
    TenantModule,
  ],
  controllers: [
    AppController,
    SocietyController,
    FlatsController,
    AdminController,
  ],
  providers: [
    AppService,
    SocietyService,
    FlatsService,
    PrismaService,
    PrismaClient,
    MailerService,
    AdminService,
  ],
})
export class AppModule {}
