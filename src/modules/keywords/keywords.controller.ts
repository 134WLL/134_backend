import { Controller, Get, Param, Post } from '@nestjs/common';
import { KeywordsService } from './keywords.service';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Post('/set/keywords')
  async createKeywords() {
    return await this.keywordsService.createKeywordQuestion();
  }

  @Post('/set/questions')
  async createQuestions() {
    return await this.keywordsService.createQuestion();
  }

  @Get('')
  async getKeyword() {
    return await this.keywordsService.getKeywords();
  }

  @Get('/question/:id')
  async getQuestionOption(@Param('id') id: number) {
    return await this.keywordsService.getQuestionOption(id);
  }

  // @Get('/question')
  // async getQuestion() {
  //   return await this.keywordsService.getQuestion();
  // }
}
