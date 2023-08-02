import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async postFeedback() {}

  @Post('/option')
  async postOptionFeedback() {}

  @Get()
  async getFeedback() {}

  @Put()
  async putFeedback() {}
}
