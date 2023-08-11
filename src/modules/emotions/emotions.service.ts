import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { EmotionsRepository } from './repositories/emotions.repository';
import { EmotionsUsersRepository } from './repositories/emotions-user.repository';

@Injectable()
export class EmotionsService {
  constructor(
    private readonly emotionsRepository: EmotionsRepository,
    private readonly emotionsusersRepository: EmotionsUsersRepository,
  ) {}

  async setEmotions() {
    try {
      const emotion_data = JSON.parse(
        readFileSync('src/emotions/data/emotion.json', 'utf8'),
      );

      emotion_data.forEach(async (emotion) => {
        const find_emotion = await this.emotionsRepository.findOne({
          where: {
            code: emotion.emotion_code,
          },
        });
        if (find_emotion) {
        } else {
          await this.emotionsRepository.save({
            code: emotion.emotion_code,
            name: emotion.emotion_name,
          });
        }
      });
      const option = `SELECT * 
      FROM emotion
      `;
      const find_emotions = await this.emotionsRepository.query(option);
      return { emotions: find_emotions };
    } catch (err) {
      throw new Error(err);
    }
  }
}
