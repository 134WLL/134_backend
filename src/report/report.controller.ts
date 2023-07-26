import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(public readonly reportService: ReportService) {}

  @Get('/:id')
  async getUserReport(@Param('id') id: number) {}

  @Post('/:id')
  async PostUserReport(@Param('id') id: number) {}
}
