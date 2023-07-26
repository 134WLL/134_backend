import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(public readonly statisticsService: StatisticsService) {}

  @Post('/:id')
  async postStatistics(@Param() id: number, @Body() body) {}

  @Get('/:id')
  async getStatistics(@Param() id: number) {}
}
