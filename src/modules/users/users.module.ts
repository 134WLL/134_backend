import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersRepository } from './repositories/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { User_Status } from './entities/user_status.entity';
import { UserNotifiesRepository } from './repositories/user-notifies.repository';
import { UserStatusRepository } from './repositories/user-status.repository';
import { User_Notify } from './entities/user_notify.entity';
import { ConversationsModule } from 'src/modules/conversations/conversations.module';
import { StatisticsModule } from 'src/modules/statistics/statistics.module';
import { Team } from '../teams/entities/team.entity';
import { TeamsModule } from '../teams/teams.module';
import { FeedbackModule } from '../feedback/feedback.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, User_Status, Team, User_Notify]),
    forwardRef(() => StatisticsModule),
    forwardRef(() => AuthModule),
    forwardRef(() => TeamsModule),
    forwardRef(() => FeedbackModule),
    forwardRef(() => ConversationsModule),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UserNotifiesRepository,
    UserStatusRepository,
  ],
  exports: [UsersService],
})
export class UsersModule {}
