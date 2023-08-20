import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConversationsService } from 'src/modules/conversations/conversations.service';
import { UsersService } from '../users/users.service';
import { TeamsService } from '../teams/teams.service';
import { KeywordsService } from '../keywords/keywords.service';
import { FeedbackService } from '../feedback/feedback.service';

@Injectable()
export class StatisticsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => TeamsService))
    private readonly teamsService: TeamsService,
    @Inject(forwardRef(() => ConversationsService))
    private readonly conversationsService: ConversationsService,
    @Inject(forwardRef(() => KeywordsService))
    private readonly keywordsService: KeywordsService,
    @Inject(forwardRef(() => FeedbackService))
    private readonly feedbackService: FeedbackService,
  ) {}

  async getTeamCharater(user_info, team_id) {
    try {
      const team_charater = await this.usersService.getStatisticCharater(
        user_info,
        team_id,
      );

      const emotion_array = [
        {
          emotion_name: '희망이 조금씩 생기는',
          emotion_count: 0,
        },
        {
          emotion_name: '점차 걱정이 생기는',
          emotion_count: 0,
        },
        {
          emotion_name: '속이 타는 마음',
          emotion_count: 0,
        },
        {
          emotion_name: '정신없이 요동치는',
          emotion_count: 0,
        },
        {
          emotion_name: '고요하고 감사한',
          emotion_count: 0,
        },
      ];
      const action_array = [
        {
          action: '경청을 잘하고, 의견을 조율하는',
          action_count: 0,
        },
        {
          action: '열정적인 목표 달성과 리더쉽',
          action_count: 0,
        },
        {
          action: '치밀한 계획과 효율이 중요한',
          action_count: 0,
        },
        {
          action: '힘을 빼고, 유쾌하게 목표 달성',
          action_count: 0,
        },
        {
          action: '고요하게, 반격을 준비하는',
          action_count: 0,
        },
      ];
      const state_array = [
        {
          state: '배움/성장',
          state_count: 0,
        },
        {
          state: '휴식/여행',
          state_count: 0,
        },
        {
          state: '공감/평화',
          state_count: 0,
        },
        {
          state: '성과달성/보상받기',
          state_count: 0,
        },
        {
          state: '변화/해결',
          state_count: 0,
        },
      ];

      team_charater.forEach((user) => {
        emotion_array[user.emotion_code - 1].emotion_count += 1;
        action_array[user.action_code - 1].action_count += 1;
        state_array[user.state_code - 1].state_count += 1;
      });

      emotion_array.sort((a, b) => b.emotion_count - a.emotion_count);
      emotion_array.forEach((emotion) => {
        if (emotion.emotion_count === 0) {
          emotion.emotion_count = 0;
        } else {
          emotion.emotion_count = Math.floor(
            (emotion.emotion_count / team_charater.length) * 100,
          );
        }
      });

      action_array.sort((a, b) => b.action_count - a.action_count);
      action_array.forEach((action) => {
        if (action.action_count === 0) {
          action.action_count = 0;
        } else {
          action.action_count = Math.floor(
            (action.action_count / team_charater.length) * 100,
          );
        }
      });

      state_array.sort((a, b) => b.state_count - a.state_count);
      state_array.forEach((state) => {
        if (state.state_count === 0) {
          state.state_count = 0;
        } else {
          state.state_count = Math.floor(
            (state.state_count / team_charater.length) * 100,
          );
        }
      });

      return {
        emotion_array: [emotion_array[0], emotion_array[1], emotion_array[2]],
        action_array: [action_array[0], action_array[1], action_array[2]],
        state_array: [state_array[0], state_array[1], state_array[2]],
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getTeamConversationLog(user_info, team_id) {
    try {
      const data = await this.conversationsService.getTeamConversation(team_id);
      if (!data.length) {
        return null;
      }

      const emotion_middle_score = [
        {
          emotion_name: 'Love',
          emotion_count: 0,
        },
        {
          emotion_name: 'Like',
          emotion_count: 0,
        },
        {
          emotion_name: 'Hug',
          emotion_count: 0,
        },
        {
          emotion_name: 'Sad',
          emotion_count: 0,
        },
        {
          emotion_name: `You're right`,
          emotion_count: 0,
        },
        {
          emotion_name: 'Angry',
          emotion_count: 0,
        },
      ];

      const keyword_middle_score = [
        {
          keyword_id: 1,
          keyword_count: 0,
        },
        {
          keyword_id: 2,
          keyword_count: 0,
        },
        {
          keyword_id: 3,
          keyword_count: 0,
        },
        {
          keyword_id: 4,
          keyword_count: 0,
        },
        {
          keyword_id: 5,
          keyword_count: 0,
        },
        {
          keyword_id: 6,
          keyword_count: 0,
        },
        {
          keyword_id: 7,
          keyword_count: 0,
        },
        {
          keyword_id: 8,
          keyword_count: 0,
        },
        {
          keyword_id: 9,
          keyword_count: 0,
        },
        {
          keyword_id: 10,
          keyword_count: 0,
        },
      ];

      const question_middle_list = [];
      for (let i = 1; i <= 100; i++) {
        question_middle_list.push({ question_id: i, question_count: 0 });
      }

      await Promise.all(
        data.map(async (e) => {
          emotion_middle_score[0].emotion_count += e.love_count;
          emotion_middle_score[1].emotion_count += e.like_count;
          emotion_middle_score[2].emotion_count += e.hug_count;
          emotion_middle_score[3].emotion_count += e.sad_count;
          emotion_middle_score[4].emotion_count += e.right_count;
          emotion_middle_score[5].emotion_count += e.angry_count;

          if (e.first_keyword == '일상') {
            keyword_middle_score[0].keyword_count += 1;
            // keyword 1
          } else if (e.first_keyword == '관계') {
            keyword_middle_score[1].keyword_count += 1;
          } else if (e.first_keyword == '나') {
            keyword_middle_score[2].keyword_count += 1;
          } else if (e.first_keyword == '휴식') {
            keyword_middle_score[3].keyword_count += 1;
          } else if (e.first_keyword == '미래/성장') {
            keyword_middle_score[4].keyword_count += 1;
          } else if (e.first_keyword == '여행') {
            keyword_middle_score[5].keyword_count += 1;
          } else if (e.first_keyword == '팀') {
            keyword_middle_score[6].keyword_count += 1;
          } else if (e.first_keyword == '커리어') {
            keyword_middle_score[7].keyword_count += 1;
          } else if (e.first_keyword == '사랑') {
            keyword_middle_score[8].keyword_count += 1;
          } else if (e.first_keyword == '일') {
            keyword_middle_score[9].keyword_count += 1;
          }

          if (e.second_keyword == '일상') {
            keyword_middle_score[0].keyword_count += 1;
          } else if (e.second_keyword == '관계') {
            keyword_middle_score[1].keyword_count += 1;
          } else if (e.second_keyword == '나') {
            keyword_middle_score[2].keyword_count += 1;
          } else if (e.second_keyword == '휴식') {
            keyword_middle_score[3].keyword_count += 1;
          } else if (e.second_keyword == '미래/성장') {
            keyword_middle_score[4].keyword_count += 1;
          } else if (e.second_keyword == '여행') {
            keyword_middle_score[5].keyword_count += 1;
          } else if (e.second_keyword == '팀') {
            keyword_middle_score[6].keyword_count += 1;
          } else if (e.second_keyword == '커리어') {
            keyword_middle_score[7].keyword_count += 1;
          } else if (e.second_keyword == '사랑') {
            keyword_middle_score[8].keyword_count += 1;
          } else if (e.second_keyword == '일') {
            keyword_middle_score[9].keyword_count += 1;
          }

          if (e.third_keyword == '일상') {
            keyword_middle_score[0].keyword_count += 1;
          } else if (e.third_keyword == '관계') {
            keyword_middle_score[1].keyword_count += 1;
          } else if (e.third_keyword == '나') {
            keyword_middle_score[2].keyword_count += 1;
          } else if (e.third_keyword == '휴식') {
            keyword_middle_score[3].keyword_count += 1;
          } else if (e.third_keyword == '미래/성장') {
            keyword_middle_score[4].keyword_count += 1;
          } else if (e.third_keyword == '여행') {
            keyword_middle_score[5].keyword_count += 1;
          } else if (e.third_keyword == '팀') {
            keyword_middle_score[6].keyword_count += 1;
          } else if (e.third_keyword == '커리어') {
            keyword_middle_score[7].keyword_count += 1;
          } else if (e.third_keyword == '사랑') {
            keyword_middle_score[8].keyword_count += 1;
          } else if (e.third_keyword == '일') {
            keyword_middle_score[9].keyword_count += 1;
          }

          if (e.first_question > 0) {
            let first_index = question_middle_list.findIndex(
              (question_middle) =>
                question_middle.question_id == e.first_question,
            );
            question_middle_list[first_index].question_count += 1;
          }

          if (e.second_question > 0) {
            let second_index = question_middle_list.findIndex(
              (question_middle) =>
                question_middle.question_id == e.second_question,
            );

            question_middle_list[second_index].question_count += 1;
          }

          if (e.third_question > 0) {
            let third_index = question_middle_list.findIndex(
              (question_middle) =>
                question_middle.question_id == e.third_question,
            );

            question_middle_list[third_index].question_count += 1;
          }
        }),
      );
      // 퍼센트로 변경 //
      emotion_middle_score.sort((a, b) => b.emotion_count - a.emotion_count);

      keyword_middle_score.sort((a, b) => b.keyword_count - a.keyword_count);

      question_middle_list.sort((a, b) => b.question_count - a.question_count);

      let emotion_total = 0;
      emotion_total += emotion_middle_score[0].emotion_count;
      emotion_total += emotion_middle_score[1].emotion_count;
      emotion_total += emotion_middle_score[2].emotion_count;
      emotion_total += emotion_middle_score[3].emotion_count;
      emotion_total += emotion_middle_score[4].emotion_count;
      emotion_total += emotion_middle_score[5].emotion_count;

      const [first, second, third] = await Promise.all([
        this.keywordsService.getQuestion({
          id: question_middle_list[0].question_id,
        }),
        this.keywordsService.getQuestion({
          id: question_middle_list[1].question_id,
        }),
        this.keywordsService.getQuestion({
          id: question_middle_list[2].question_id,
        }),
      ]);

      emotion_middle_score[0].emotion_count = Math.floor(
        (emotion_middle_score[0].emotion_count / emotion_total) * 100,
      );
      emotion_middle_score[1].emotion_count = Math.floor(
        (emotion_middle_score[1].emotion_count / emotion_total) * 100,
      );
      emotion_middle_score[2].emotion_count = Math.floor(
        (emotion_middle_score[2].emotion_count / emotion_total) * 100,
      );

      keyword_middle_score[0].keyword_count = Math.floor(
        (keyword_middle_score[0].keyword_count / data.length) * 100,
      );

      keyword_middle_score[1].keyword_count = Math.floor(
        (keyword_middle_score[1].keyword_count / data.length) * 100,
      );

      keyword_middle_score[2].keyword_count = Math.floor(
        (keyword_middle_score[2].keyword_count / data.length) * 100,
      );

      return {
        emotion_score: [
          emotion_middle_score[0],
          emotion_middle_score[1],
          emotion_middle_score[2],
        ],
        keyword_score: [
          keyword_middle_score[0],
          keyword_middle_score[1],
          keyword_middle_score[2],
        ],
        question_list: [first.content, second.content, third.content], // score 순서대로
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getTeamFeedbackLog(user_info, team_id) {
    try {
      const find_feedbacks = await this.usersService.getUserFeedback(team_id);

      if (!find_feedbacks.length) return null;

      const feedback = {
        energy_percent: 0,
        relation_percent: 0,
        stress_percent: 0,
        stable_percent: 0,
      };

      find_feedbacks.forEach((find_feedback) => {
        feedback.energy_percent += find_feedback.energy;
        feedback.relation_percent += find_feedback.relation;
        feedback.stress_percent += find_feedback.stress;
        feedback.stable_percent += find_feedback.stable;
      });

      feedback.energy_percent = Math.floor(
        feedback.energy_percent / find_feedbacks.length,
      );
      feedback.relation_percent = Math.floor(
        feedback.relation_percent / find_feedbacks.length,
      );
      feedback.stress_percent = Math.floor(
        feedback.stress_percent / find_feedbacks.length,
      );
      feedback.stable_percent = Math.floor(
        feedback.stable_percent / find_feedbacks.length,
      );

      return {
        energy_percent: feedback.energy_percent,
        relation_percent: feedback.relation_percent,
        stress_percent: feedback.stress_percent,
        stable_percent: feedback.stable_percent,
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getUsersReport(user_info, id) {
    try {
      const data = await this.usersService.getUserReport(user_info, id);

      const my_report_list = [];
      data.forEach((e) => {
        my_report_list.push({
          report_date: e.reg_create_date,
          report_id: e.id,
        });
      });

      return {
        my_report_list,
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getUsersReportDetail(user_info, id, report_id) {
    try {
      const user_report = await this.usersService.getUserReportDetail(
        user_info,
        id,
        report_id,
      );

      const data = await this.conversationsService.findConversationUsersByDate(
        id,
        user_report.reg_create_date,
      );

      const conversation_feedback_array = [];

      const received_emotions = [];

      data.forEach((e) => {
        let emtion = [
          {
            emotion_name: 'Love',
            emotion_count: e.love_count,
          },
          {
            emotion_name: 'Like',
            emotion_count: e.like_count,
          },
          {
            emotion_name: 'Hug',
            emotion_count: e.hug_count,
          },
          {
            emotion_name: 'Sad',
            emotion_count: e.sad_count,
          },
          {
            emotion_name: `You're right`,
            emotion_count: e.right_count,
          },
          {
            emotion_name: 'Angry',
            emotion_count: e.angry_count,
          },
        ];
        const result_emotions = emtion.filter(
          (emotion) => emotion.emotion_count > 0,
        );

        received_emotions.push(result_emotions);

        conversation_feedback_array.push(e.id);
      });

      const feedback_data = await this.feedbackService.getFeedbackUserDetail(
        conversation_feedback_array,
      );

      const feed_contents = [];
      const feed_scores = [];
      for (let i = 0; i < feedback_data.length; i++) {
        feed_contents.push(feedback_data[i].content);
        feed_scores.push(feedback_data[i].score);
      }

      const feedback_user = await this.feedbackService.getFeedbackByUser(
        id,
        user_report.reg_create_date,
      );
      const review_list = [];

      await Promise.all(
        feedback_user.map(async (feed) => {
          const user = await this.usersService.findOne({
            id: feed.send_user_id,
          });
          review_list.push({
            nickname: user.nickname,
            profile_img_url: user.profile_image_url,
            review_content: feed.content,
          });
        }),
      );

      return {
        report_date: user_report.reg_create_date, // yyyy-MM-dd 형식
        conversation_count: user_report.conversation_count, // 대화 갯수
        effect: {
          energy: user_report.energy,
          relation: user_report.relation,
          stable: user_report.stable,
          stress: user_report.stress,
        },
        received_emotions: received_emotions,
        feed_contents,
        feed_scores,
        review_list,
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getUsersLog(user_info, team_id) {
    try {
      const team_users = await this.usersService.getUserLog(user_info, team_id);
      const return_data = [];
      team_users.forEach((user) => {
        let new_data = {
          id: user.id,
          profile_image_url: user.profile_image_url,
          name: user.name,
          nickname: user.nickname,
          conversation_count: 0,
        };

        user.status_array.forEach((status) => {
          new_data.conversation_count += status.conversation_count;
        });

        return_data.push(new_data);
      });
      // const conversations_users =
      //   await this.conversationsService.find_conversation_user(team_users);

      return return_data;
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getUsersSearchLog(user_info, team_id, name) {
    try {
      const team_users = await this.usersService.getUserSearchLog(
        user_info,
        team_id,
        name,
      );
      const return_data = [];
      team_users.forEach((user) => {
        let new_data = {
          id: user.id,
          profile_image_url: user.profile_image_url,
          name: user.name,
          nickname: user.nickname,
          conversation_count: 0,
        };

        user.status_array.forEach((status) => {
          new_data.conversation_count += status.conversation_count;
        });

        return_data.push(new_data);
      });

      return return_data;
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getUserReport(user_info, team_id, user_id) {
    try {
      const find_user = await this.usersService.findOne({ id: user_id });

      const find_conversation_user =
        await this.conversationsService.findConversationsUsers(user_id);

      const received_emotions = [
        {
          emotion_name: 'Love',
          emotion_count: 0,
        },
        {
          emotion_name: 'Like',
          emotion_count: 0,
        },
        {
          emotion_name: 'Hug',
          emotion_count: 0,
        },
        {
          emotion_name: 'Sad',
          emotion_count: 0,
        },
        {
          emotion_name: `You're right`,
          emotion_count: 0,
        },
        {
          emotion_name: 'Angry',
          emotion_count: 0,
        },
      ];
      const feedback_user_id = [];
      find_conversation_user.forEach((user) => {
        received_emotions[0].emotion_count += user.love_count;
        received_emotions[1].emotion_count += user.like_count;
        received_emotions[2].emotion_count += user.hug_count;
        received_emotions[3].emotion_count += user.sad_count;
        received_emotions[4].emotion_count += user.right_count;
        received_emotions[5].emotion_count += user.angry_count;
        feedback_user_id.push(user.id);
      });

      const result_emotions = received_emotions.filter(
        (emotion) => emotion.emotion_count > 0,
      );

      let energy_percent = 0;
      let relation_percent = 0;
      let stress_percent = 0;
      let stable_percent = 0;

      const user_status_array = await this.usersService.getUserReports(
        user_info,
        user_id,
      );

      let conversation_count = 0;

      user_status_array.forEach((status) => {
        energy_percent += status.energy;
        relation_percent += status.relation;
        stress_percent += status.stress;
        stable_percent += status.stable;
        conversation_count += status.conversation_count;
      });
      let score_percent = 0;

      const feedback_array = [];
      await Promise.all(
        feedback_user_id.map(async (cov_user_id) => {
          const feedbacks = await this.feedbackService.getFeedbackScores(
            cov_user_id,
          );

          feedbacks.forEach((feedback) => {
            feedback_array.push(feedback);
          });
        }),
      );

      feedback_array.forEach((feed) => {
        score_percent += feed.score;
      });

      return {
        nickname: find_user.nickname,
        name: find_user.name,
        conversation_count,
        energy_percent: Math.floor(energy_percent / user_status_array.length),
        relation_percent: Math.floor(
          relation_percent / user_status_array.length,
        ),
        stress_percent: Math.floor(stress_percent / user_status_array.length),
        stable_percent: Math.floor(stable_percent / user_status_array.length),
        received_emotions: result_emotions,
        score_percent: Math.floor(score_percent / feedback_array.length), // 대화 만족도 평균
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
