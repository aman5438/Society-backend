import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

interface JwtUser {
  sub: number;
  role: string;
}

@Controller('owner')
@UseGuards(JwtAuthGuard)
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('flat-status')
  async getOwnerFlat(@Req() req: Request) {
    const user = req.user as JwtUser;

    if (!user?.sub) {
      throw new Error('User ID not found in request');
    }

    return this.ownerService.getFlatForOwner(user.sub);
  }
}
