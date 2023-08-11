import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAccessGuard } from 'src/modules/auth/jwt/guards/jwt-access.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async postFeedback(@CurrentUser() user, @Body() body) {
    return await this.feedbackService.postFeedback(user, body);
  }

  @Post('/option')
  @UseGuards(JwtAccessGuard)
  async postOptionFeedback(@CurrentUser() user, @Body() body) {
    return await this.feedbackService.postOptionFeedback(user, body);
  }

  @Get()
  @UseGuards(JwtAccessGuard)
  async getFeedback(@CurrentUser() user) {
    return await this.feedbackService.getFeedback(user);
  }

  @Put('/:id')
  @UseGuards(JwtAccessGuard)
  async putFeedback(
    @Param('id') id: number,
    @CurrentUser() user,
    @Body() body,
  ) {
    return await this.feedbackService.putFeedback(id, user, body);
  }
}
