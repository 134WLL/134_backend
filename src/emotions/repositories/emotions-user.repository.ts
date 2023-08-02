import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Emotion } from '../entities/emotion.entity';
import { Repository } from 'typeorm';
import { Emotion_User } from '../entities/emotion_user.entity';

@Injectable()
export class EmotionsUserRepository {
  constructor(
    @InjectRepository(Emotion_User)
    private emotionUserRepository: Repository<Emotion_User>,
  ) {}

  async save(options) {
    return await this.emotionUserRepository.save(options);
  }

  async find(options) {
    return await this.emotionUserRepository.find(options);
  }

  async findOne(options) {
    return await this.emotionUserRepository.findOne(options);
  }

  async update(id, options) {
    return await this.emotionUserRepository.update(id, options);
  }

  async query(options) {
    return await this.emotionUserRepository.query(options);
  }
}
