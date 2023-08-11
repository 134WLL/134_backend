import { Module, forwardRef } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

import { ConversationsModule } from 'src/modules/conversations/conversations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsModule } from '../teams/teams.module';
import { UsersModule } from '../users/users.module';
import { KeywordsModule } from '../keywords/keywords.module';
import { FeedbackModule } from '../feedback/feedback.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    forwardRef(() => TeamsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ConversationsModule),
    forwardRef(() => KeywordsModule),
    forwardRef(() => FeedbackModule),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
