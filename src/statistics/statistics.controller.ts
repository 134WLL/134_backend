import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(public readonly statisticsService: StatisticsService) {}

  @Get('/teams/:team_id/character')
  async getTeamCharater(@Param('team_id') team_id: number) {
    return {
      emotion_array: [
        {
          emotion_name: 'Love',
          emotion_count: 0,
        },
      ],
      action_array: [
        {
          action: '',
          action_count: 0,
        },
      ],
      state_array: [
        {
          state: '',
          state_count: 0,
        },
      ],
    };
  }

  @Get('/teams/:team_id/conversation-log')
  async getTeamConversationLog(@Param('team_id') team_id: number) {
    return {
      emotion_score: [
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
      ],
      keyword_score: [
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
      ],
      question_list: [], // score 순서대로
    };
  }

  @Get('/teams/:team_id/feedback-log')
  async getTeamFeedbackLog(@Param('team_id') team_id: number) {
    return {
      energy_percent: 0,
      relation_percent: 0,
      stress_percent: 0,
      stable_percent: 0,
    };
  }

  @Get('/users/:id/reports')
  async getUsersReport(@Param('id') id: number) {
    return {
      my_report_list: [
        {
          report_date: `2022-03-13`, // 날짜 yyyy-MM-dd 형식
          report_id: 1,
        },
      ],
    };
  }

  @Get('/users/:id/reports/:report_id')
  async getUsersReportDetail(
    @Param('id') id: number,
    @Param('report_id') report_id: number,
  ) {
    return {
      report_date: `2022-03-13`, // yyyy-MM-dd 형식
      conversation_count: 2, // 대화 갯수
      effect: {
        energy: 20,
        relation: 30,
        stable: -30,
        stress: 70,
      },
      received_emotions: [
        [
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
        ],
      ],
      feed_contents: ['', '', '', ''],
      feed_scores: [30, 40, 50, 60],
      review_list: [
        {
          nickname: null,
          profile_img_url: null,
          review_content: null,
        },
      ],
    };
  }

  @Get('/editor/teams/:team_id/user-log')
  async getUserLogs(@Param('team_id') team_id: number) {
    return [
      {
        id: null, // user_id
        profile_image_url: null,
        name: null,
        nickname: null,
        conversation_count: null, // 대화 참여 횟수
      },
    ];
  }

  @Get('/editor/teams/:team_id/users/:user_id/report')
  async getUserReport(
    @Param('team_id') team_id: number,
    @Param('user_id') user_id: number,
  ) {
    return {
      nickname: null,
      name: null,
      converstaion_count: null,
      energy_percent: null,
      relation_percent: null,
      stress_percent: null,
      stable_percent: null,
      received_emotions: [
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
      ],
      score_percent: null, // 대화 만족도 평균
    };
  }

  @Post('/:id')
  async postStatistics(@Param() id: number, @Body() body) {}

  @Get('/:id')
  async getStatistics(@Param() id: number) {}
}
