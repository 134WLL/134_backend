import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('/:id')
  async getUserFeedback(@Param('id') id: number) {}

  @Post('/:id')
  async postUserFeedback(@Param('id') id: number) {}
}
