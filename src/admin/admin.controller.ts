import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
  Delete,
  Put,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateFlatDto } from './dto/update-flat.dto';

type AuthenticatedRequest = Request & {
  user: {
    sub: number;
    role?: string;
    email?: string;
  };
};

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SOCIETY_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('signup-requests')
  getAllSignupRequests(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.sub;
    return this.adminService.getPendingSignupRequests(adminId);
  }

  @Post('signup-requests/:id/approve')
  approveSignupRequest(@Param('id') id: string) {
    return this.adminService.updateSignupStatus(Number(id), 'APPROVED');
  }

  @Post('signup-requests/:id/reject')
  rejectSignupRequest(@Param('id') id: string) {
    return this.adminService.updateSignupStatus(Number(id), 'REJECTED');
  }

  @Get('flats')
  async getAllFlats(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.sub;
    return this.adminService.getAllFlats(adminId);
  }

  @Get('dashboard-stats')
  getDashboard(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.sub;
    return this.adminService.getDashboardStats(adminId);
  }

  @Get('societies')
  getSocieties(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.sub;
    return this.adminService.getAssignedSocieties(adminId);
  }

  @Put('flats/:id')
  async updateFlat(@Param('id') id: number, @Body() body: UpdateFlatDto) {
    const updated = await this.adminService.updateFlat(id, body);
    if (!updated) throw new NotFoundException('Flat not found');
    return { message: 'Flat updated successfully' };
  }

  @Delete('flats/:id')
  async deleteFlat(@Param('id') id: number) {
    const deleted = await this.adminService.deleteFlat(id);
    if (!deleted)
      throw new NotFoundException('Flat not found or already deleted');
    return { message: 'Flat deleted successfully' };
  }
}
