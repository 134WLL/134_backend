import { Module, forwardRef } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TeamsRepository } from './teams.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { ConversationsModule } from 'src/modules/conversations/conversations.module';
import { Conversation_Room } from 'src/modules/conversations/entities/conversation_room.entity';
import { Conversation_User } from 'src/modules/conversations/entities/conversation_user.entity';
import { StatisticsModule } from 'src/modules/statistics/statistics.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation_User,
      Conversation_Room,
      Team,
      User,
    ]),
    forwardRef(() => StatisticsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ConversationsModule),
  ],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository],
  exports: [TeamsService],
})
export class TeamsModule {}
