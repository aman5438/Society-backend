import { Controller, Get, Query } from '@nestjs/common';
import { FlatsService } from './flats.service';

@Controller('flats')
export class FlatsController {
  constructor(private readonly flatsService: FlatsService) {}

  @Get()
  getFlats(@Query('societyId') societyId: number) {
    return this.flatsService.getFlatsBySociety(Number(societyId));
  }
}
