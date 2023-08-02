import { Module, forwardRef } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ConversationsGateway } from './conversations.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation_User } from './entities/conversation_user.entity';
import { ConversationsRepository } from './repositories/conversations.repository';
import { Conversation_Room } from './entities/conversation_room.entity';
import { Team } from 'src/teams/entities/team.entity';
import { TeamsModule } from 'src/teams/teams.module';
import { Conversation_Room_Emotion } from './entities/conversation_room_emotion.entity';
import { EmotionsModule } from 'src/emotions/emotions.module';
import { KeywordsModule } from 'src/keywords/keywords.module';
import { ConversationRoomEmotionsRepository } from './repositories/conversation-room-emotions.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation_User,
      Conversation_Room,
      Conversation_Room_Emotion,
      Team,
    ]),
    forwardRef(() => TeamsModule),
    forwardRef(() => EmotionsModule),
    forwardRef(() => KeywordsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [ConversationsController],
  providers: [
    ConversationsService,
    ConversationsRepository,
    ConversationsGateway,
    ConversationRoomEmotionsRepository,
  ],
  exports: [ConversationsService],
})
export class ConversationsModule {}
