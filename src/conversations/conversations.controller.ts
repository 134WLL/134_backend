import { Body, Controller, Param, Post } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { KeywordRequestDto } from './dtos/keyword-reqeust.dto';

@Controller('conversation-rooms')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post('/teams/:team_id')
  async createTeamConversation(
    @Param('team_id') team_id: string,
    @Body() body,
  ) {
    await this.conversationsService.createRoom(team_id, body);
  }

  @Post('/:conversationRoomId/users/:userId/keywords')
  async chooseKeyword(
    @Param() conversationRoomId: number,
    @Param() userId: number,
    @Body() body: KeywordRequestDto,
  ) {
    return this.conversationsService.chooseKeyword(
      conversationRoomId,
      userId,
      body,
    );
  }

  @Post('/:id')
  async chooseCard(@Param() id: number, @Body() body) {
    return await this.conversationsService.chooseCard(body);
  }

  @Post('feedback/:id')
  async sendFeedback(@Param() id: number, @Body() body) {
    const content = body.content;
  }

  @Post('report/:id')
  async sendReport(@Param() id: number, @Body() body) {
    const content = body.content;
  }
}
