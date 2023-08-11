import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAccessGuard } from 'src/modules/auth/jwt/guards/jwt-access.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('statistics')
export class StatisticsController {
  constructor(public readonly statisticsService: StatisticsService) {}

  @Get('/teams/:team_id/character')
  @UseGuards(JwtAccessGuard)
  async getTeamCharater(
    @CurrentUser() user_info,
    @Param('team_id') team_id: number,
  ) {
    return await this.statisticsService.getTeamCharater(user_info, team_id);
  }

  @Get('/teams/:team_id/conversation-log')
  @UseGuards(JwtAccessGuard)
  async getTeamConversationLog(
    @CurrentUser() user_info,
    @Param('team_id') team_id: number,
  ) {
    return await this.statisticsService.getTeamConversationLog(
      user_info,
      team_id,
    );
  }

  @Get('/teams/:team_id/feedback-log')
  @UseGuards(JwtAccessGuard)
  async getTeamFeedbackLog(
    @CurrentUser() user_info,
    @Param('team_id') team_id: number,
  ) {
    return await this.statisticsService.getTeamFeedbackLog(user_info, team_id);
  }

  @Get('/users/:id/reports')
  @UseGuards(JwtAccessGuard)
  async getUsersReport(@CurrentUser() user_info, @Param('id') id: number) {
    return await this.statisticsService.getUsersReport(user_info, id);
    // {
    //   report_date: `2022-03-13`, // 날짜 yyyy-MM-dd 형식
    //   report_id: 1,
    // },
  }

  @Get('/users/:id/reports/:report_id')
  @UseGuards(JwtAccessGuard)
  async getUsersReportDetail(
    @CurrentUser() user_info,
    @Param('id') id: number,
    @Param('report_id') report_id: number,
  ) {
    return await this.statisticsService.getUsersReportDetail(
      user_info,
      id,
      report_id,
    );
  }

  @Get('/editor/teams/:team_id/user-log/search')
  @UseGuards(JwtAccessGuard)
  async getUserLogSearch(
    @CurrentUser() user_info,
    @Param('team_id') team_id: number,
    @Query('name') name: string,
  ) {
    return await this.statisticsService.getUsersSearchLog(
      user_info,
      team_id,
      name,
    );
  }

  @Get('/editor/teams/:team_id/user-log')
  @UseGuards(JwtAccessGuard)
  async getUserLogs(
    @CurrentUser() user_info,
    @Param('team_id') team_id: number,
  ) {
    return await this.statisticsService.getUsersLog(user_info, team_id);
  }

  @Get('/editor/teams/:team_id/users/:user_id/report')
  @UseGuards(JwtAccessGuard)
  async getUserReport(
    @CurrentUser() user_info,
    @Param('team_id') team_id: number,
    @Param('user_id') user_id: number,
  ) {
    return await this.statisticsService.getUserReport(
      user_info,
      team_id,
      user_id,
    );
  }
}
