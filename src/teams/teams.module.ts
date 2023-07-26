import { Module, forwardRef } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TeamsRepository } from './teams.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { UsersModule } from 'src/users/users.module';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { Conversation_Room } from 'src/conversations/entities/conversation_room.entity';
import { Conversation_User } from 'src/conversations/entities/conversation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation_User, Conversation_Room, Team]),
    forwardRef(() => UsersModule),
    forwardRef(() => ConversationsModule),
  ],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository],
  exports: [TeamsService],
})
export class TeamsModule {}
