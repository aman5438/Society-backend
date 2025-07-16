import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('tenant')
@UseGuards(JwtAuthGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get(':id')
  async getAllTenants(@Req() req: Request & { user: JwtPayload }) {
    const userId = req.user.sub;
    return this.tenantService.findAll(userId);
  }
}
