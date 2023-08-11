import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Emotion } from '../entities/emotion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmotionsRepository {
  constructor(
    @InjectRepository(Emotion)
    private emotionRepository: Repository<Emotion>,
  ) {}

  async save(options) {
    return await this.emotionRepository.save(options);
  }

  async find(options) {
    return await this.emotionRepository.find(options);
  }

  async findOne(options) {
    return await this.emotionRepository.findOne(options);
  }

  async update(id, options) {
    return await this.emotionRepository.update(id, options);
  }

  async query(options) {
    return await this.emotionRepository.query(options);
  }
}
