import { Module } from '@nestjs/common';
import { KeywordsController } from './keywords.controller';
import { KeywordsService } from './keywords.service';
import { KeywordsRepository } from './keywords.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword } from './entities/keyword.entity';
import { Question } from './entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword, Question])],
  controllers: [KeywordsController],
  providers: [KeywordsService, KeywordsRepository],
})
export class KeywordsModule {}
