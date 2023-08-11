import { Injectable } from '@nestjs/common';
import { Feedback_User } from '../entities/feedback_user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FeedbackUsersRepository {
  constructor(
    @InjectRepository(Feedback_User)
    private feedbackUserRepository: Repository<Feedback_User>,
  ) {}

  async save(options) {
    return await this.feedbackUserRepository.save(options);
  }

  async find(options) {
    return await this.feedbackUserRepository.find(options);
  }

  async findOne(options) {
    return await this.feedbackUserRepository.findOne(options);
  }

  async update(id, options) {
    return await this.feedbackUserRepository.update(id, options);
  }

  async query(options) {
    return await this.feedbackUserRepository.query(options);
  }
}
