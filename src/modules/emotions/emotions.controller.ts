import { Controller, Post } from '@nestjs/common';
import { EmotionsService } from './emotions.service';

@Controller('emotions')
export class EmotionsController {
  constructor(private readonly emotionsService: EmotionsService) {}

  @Post('/set')
  async setEmotion() {
    await this.emotionsService.setEmotions();
  }
}
