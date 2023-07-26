import { Module, forwardRef } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ConversationsGateway } from './conversations.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation_User } from './entities/conversation.entity';
import { ConversationsRepository } from './conversations.repository';
import { Conversation_Room } from './entities/conversation_room.entity';
import { Team } from 'src/teams/entities/team.entity';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation_User, Conversation_Room, Team]),
    forwardRef(() => TeamsModule),
  ],
  controllers: [ConversationsController],
  providers: [
    ConversationsService,
    ConversationsGateway,
    ConversationsRepository,
  ],
  exports: [ConversationsService],
})
export class ConversationsModule {}
