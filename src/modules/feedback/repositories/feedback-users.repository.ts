import { BadRequestException, Injectable } from '@nestjs/common';
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

  async findFeedbackByConversationUserIdDate(
    review_user_id: number,
    created_date,
  ) {
    try {
      return await this.feedbackUserRepository.query(`
      SELECT *
      FROM feedback_user
      WHERE review_user_id = ${review_user_id}
      AND DATE_FORMAT(created_at, '%Y-%m-%d' ) = '${created_date}'`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
