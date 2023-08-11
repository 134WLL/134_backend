import { Module, forwardRef } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ConversationsGateway } from './conversations.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation_User } from './entities/conversation_user.entity';
import { ConversationsRepository } from './repositories/conversations.repository';
import { Conversation_Room } from './entities/conversation_room.entity';
import { Conversation_Room_Emotion } from './entities/conversation_room_emotion.entity';
import { ConversationRoomEmotionsRepository } from './repositories/conversation-room-emotions.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { StatisticsModule } from 'src/modules/statistics/statistics.module';
import { Team } from '../teams/entities/team.entity';
import { TeamsModule } from '../teams/teams.module';
import { EmotionsModule } from '../emotions/emotions.module';
import { KeywordsModule } from '../keywords/keywords.module';
import { UsersModule } from '../users/users.module';
import { FeedbackModule } from '../feedback/feedback.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation_User,
      Conversation_Room,
      Conversation_Room_Emotion,
      Team,
    ]),
    ScheduleModule.forRoot(),
    forwardRef(() => StatisticsModule),
    forwardRef(() => TeamsModule),
    forwardRef(() => EmotionsModule),
    forwardRef(() => KeywordsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => FeedbackModule),
  ],
  controllers: [ConversationsController],
  providers: [
    ConversationsService,
    ConversationsRepository,
    ConversationsGateway,
    ConversationRoomEmotionsRepository,
  ],
  // gateway : export;
  exports: [
    ConversationsRepository,
    ConversationsService,
    ConversationsGateway,
  ],
})
export class ConversationsModule {}
