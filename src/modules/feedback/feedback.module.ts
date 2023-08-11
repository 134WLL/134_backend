import { Module, forwardRef } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { FeedbackRepository } from './repositories/feedback.repository';
import { FeedbackUsersRepository } from './repositories/feedback-users.repository';
import { Feedback_User } from './entities/feedback_user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { ConversationsModule } from 'src/modules/conversations/conversations.module';
import { StatisticsModule } from 'src/modules/statistics/statistics.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback, Feedback_User]),
    forwardRef(() => StatisticsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ConversationsModule),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository, FeedbackUsersRepository],
  exports: [FeedbackService],
})
export class FeedbackModule {}
