import { Controller, Get, Post } from '@nestjs/common';
import { KeywordsService } from './keywords.service';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Get('/set')
  async createKeywordQuestion() {
    await this.keywordsService.createKeywordQuestion();
  }
}
