import { Module, forwardRef } from '@nestjs/common';
import { KeywordsController } from './keywords.controller';
import { KeywordsService } from './keywords.service';
import { KeywordsRepository } from './repositories/keywords.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword } from './entities/keyword.entity';
import { Question } from './entities/question.entity';
import { QuestionsRepository } from './repositories/questions.repository';
import { ConversationsModule } from 'src/modules/conversations/conversations.module';
import { StatisticsModule } from 'src/modules/statistics/statistics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Keyword, Question]),
    forwardRef(() => ConversationsModule),
    forwardRef(() => StatisticsModule),
  ],
  controllers: [KeywordsController],
  providers: [KeywordsService, KeywordsRepository, QuestionsRepository],
  exports: [KeywordsService],
})
export class KeywordsModule {}
