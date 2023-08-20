import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { FeedbackRepository } from './repositories/feedback.repository';
import { FeedbackUsersRepository } from './repositories/feedback-users.repository';
import { ConversationsRepository } from 'src/modules/conversations/repositories/conversations.repository';
import { UsersService } from '../users/users.service';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly feedbackUsersRepository: FeedbackUsersRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ConversationsRepository))
    private readonly conversationsRepository: ConversationsRepository,
  ) {}

  async postOptionFeedback(user, body) {
    try {
      const {
        conversation_room_id,
        conversation_user_id,
        feed_score,
        feed_content,
        review_list,
      } = body;

      await this.feedbackRepository.save({
        content: feed_content,
        score: feed_score,
        conversation_user: conversation_user_id,
      });

      if (review_list.length) {
        await Promise.all(
          review_list.map(async (review) => {
            await this.feedbackUsersRepository.save({
              content: review.review_content,
              send_user_id: user.id,
              review_user_id: review.review_user_id,
            });
          }),
        );
      }
      await this.conversationsRepository.userUpdate(conversation_user_id, {
        remained_feedback: 1,
      });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async postFeedback(user, body) {
    try {
      const {
        conversation_room_id,
        conversation_user_id,
        status_energy,
        status_relation,
        status_stress,
        status_stable,
      } = body;

      const find_room = await this.conversationsRepository.roomFindOne({
        where: { id: conversation_room_id },
      });

      const new_date = this.usersService.todayDate();
      const find_feedback = await this.usersService.getFeedback(user.id);

      if (find_feedback) {
        throw new BadRequestException('이미 오늘 피드백을 만들었습니다!');
      }

      await this.usersService.postFeedback(user, body, new_date);

      if (find_room.member_count == find_room.feedback_remained_member + 1) {
        await Promise.all([
          this.conversationsRepository.roomUpdate(conversation_room_id, {
            feedback_remained_member: find_room.feedback_remained_member + 1,
            progress_flag: false,
          }),
          this.conversationsRepository.userUpdate(conversation_user_id, {
            remained_feedback: 2,
          }),
        ]);
      } else {
        await Promise.all([
          this.conversationsRepository.roomUpdate(conversation_room_id, {
            feedback_remained_member: find_room.feedback_remained_member + 1,
          }),
          this.conversationsRepository.userUpdate(conversation_user_id, {
            remained_feedback: 2,
          }),
        ]);
      }
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async putFeedback(id, user, body) {
    try {
      const {
        conversation_room_id,
        conversation_user_id,
        status_energy,
        status_relation,
        status_stress,
        status_stable,
      } = body;

      const find_room = await this.conversationsRepository.roomFindOne({
        where: { id: conversation_room_id },
      });

      await this.usersService.putFeedback(id, user, body);

      if (find_room.member_count == find_room.feedback_remained_member + 1) {
        await Promise.all([
          this.conversationsRepository.roomUpdate(conversation_room_id, {
            feedback_remained_member: find_room.feedback_remained_member + 1,
            progress_flag: false,
          }),
          this.conversationsRepository.userUpdate(conversation_user_id, {
            remained_feedback: 2,
          }),
        ]);
      } else {
        await Promise.all([
          this.conversationsRepository.roomUpdate(conversation_room_id, {
            feedback_remained_member: find_room.feedback_remained_member + 1,
          }),
          this.conversationsRepository.userUpdate(conversation_user_id, {
            remained_feedback: 2,
          }),
        ]);
      }
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getFeedback(user) {
    try {
      const new_date = this.usersService.todayDate();
      const feedback = await this.usersService.getFeedback(user);
      if (!feedback) {
        return {
          status_id: null,
          name: user.name,
          nickname: user.nickname,
          remained_feedback: false,
          status_energy: 0,
          status_relation: 0,
          status_stress: 0,
          status_stable: 0,
        };
      }
      return {
        status_id: feedback.status.id,
        name: user.name,
        nickname: user.nickname,
        remained_feedback: true,
        status_energy: feedback.status.energy,
        status_relation: feedback.status.relation,
        status_stress: feedback.status.stress,
        status_stable: feedback.status.stable,
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getFeedbackUserDetail(conversation_feedback_array) {
    try {
      const feedback_array = [];
      await Promise.all(
        conversation_feedback_array.map(async (id) => {
          const [feedback] =
            await this.feedbackRepository.findFeedbackByConversationUserId(id);

          feedback_array.push(feedback);
        }),
      );
      return feedback_array;
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getFeedbackByUser(id, create_date) {
    try {
      return await this.feedbackUsersRepository.findFeedbackByConversationUserIdDate(
        id,
        create_date,
      );
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getFeedbackScores(feedback_user_id) {
    try {
      return await this.feedbackRepository.findFeedbackByConversationUserId(
        feedback_user_id,
      );
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
