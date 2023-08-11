import { Module, forwardRef } from '@nestjs/common';
import { EmotionsController } from './emotions.controller';
import { EmotionsService } from './emotions.service';
import { Emotion } from './entities/emotion.entity';
import { Emotion_User } from './entities/emotion_user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmotionsRepository } from './repositories/emotions.repository';
import { EmotionsUsersRepository } from './repositories/emotions-user.repository';
import { ConversationsModule } from 'src/modules/conversations/conversations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Emotion, Emotion_User]),
    forwardRef(() => ConversationsModule),
  ],
  controllers: [EmotionsController],
  providers: [EmotionsService, EmotionsRepository, EmotionsUsersRepository],
})
export class EmotionsModule {}
