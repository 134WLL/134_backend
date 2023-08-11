import { Injectable } from '@nestjs/common';
import { Feedback } from '../entities/feedback.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackRepository {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async save(options) {
    return await this.feedbackRepository.save(options);
  }

  async find(options) {
    return await this.feedbackRepository.find(options);
  }

  async findOne(options) {
    return await this.feedbackRepository.findOne(options);
  }

  async update(id, options) {
    return await this.feedbackRepository.update(id, options);
  }

  async query(options) {
    return await this.feedbackRepository.query(options);
  }
}
