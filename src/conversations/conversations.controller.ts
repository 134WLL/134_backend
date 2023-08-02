import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { KeywordRequestDto } from './dtos/keyword-reqeust.dto';
import { JwtAccessGuard } from 'src/auth/jwt/guards/jwt-access.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

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

  @Put('/:conversation_room_id/conversation-users/:conversation_user_id')
  @UseGuards(JwtAccessGuard)
  async findConversationRoom(
    @CurrentUser() userInfo,
    @Param('conversation_room_id') conversation_room_id: number,
    @Param('conversation_user_id') conversation_user_id: number,
    @Body() body,
  ) {
    return await this.conversationsService.findConversationRoom(
      userInfo,
      conversation_room_id,
      conversation_user_id,
      body,
    );
  }

  @Get(
    '/:conversation_room_id/conversation-users/:conversation_user_id/keywords',
  )
  async findConversationRoomUserKeywords(
    @Param('conversation_room_id') conversation_room_id: number,
    @Param('conversation_user_id') conversation_user_id: number,
  ) {
    return await this.conversationsService.getConversationUserKeywordCount(
      conversation_room_id,
      conversation_user_id,
    );
  }

  @Post(
    '/:conversation_room_id/conversation-users/:conversation_user_id/keywords',
  )
  async chooseConversationRoomUserKeywords(
    @Param('conversation_room_id') conversation_room_id: number,
    @Param('conversation_user_id') conversation_user_id: number,
    @Body() keyword_code: string[],
  ) {
    return await this.conversationsService.chooseConversationUserKeyword(
      conversation_room_id,
      conversation_user_id,
      keyword_code,
    );
  }

  @Put(
    '/:conversation_room_id/conversation-users/:conversation_user_id/keywords',
  )
  async changeConversationRoomUserKeywords(
    @Param('conversation_room_id') conversation_room_id: number,
    @Param('conversation_user_id') conversation_user_id: number,
    @Body() keyword_code: string[],
  ) {
    return await this.conversationsService.reChooseConversationUserKeyword(
      conversation_room_id,
      conversation_user_id,
      keyword_code,
    );
  }

  @Get(
    '/:conversation_room_id/conversation-users/:conversation_user_id/keywords/questions',
  )
  async getQuestionsByKeywords(
    @Param('conversation_room_id') conversation_room_id: number,
    @Param('conversation_user_id') conversation_user_id: number,
  ) {
    return await this.conversationsService.getSequenceQuestion(
      conversation_room_id,
      conversation_user_id,
    );
  }

  @Post(
    '/:conversation_room_id/conversation-users/:conversation_user_id/keywords/questions',
  )
  async chooseQuestionsByKeywords(
    @Param('conversation_room_id') conversation_room_id: number,
    @Param('conversation_user_id') conversation_user_id: number,
    @Body() question_code_list,
  ) {
    return await this.conversationsService.registerSequenceQuestion(
      conversation_room_id,
      conversation_user_id,
      question_code_list,
    );
  }

  @Post(
    '/:conversation_room_id/conversation-users/:conversation_user_id/cancel',
  )
  async goOutConversationRoom(
    @Param('conversation_room_id') conversation_room_id: number,
    @Param('conversation_user_id') conversation_user_id: number,
  ) {
    return await this.conversationsService.getOutConversationRoom(
      conversation_room_id,
      conversation_user_id,
    );
  }
}
