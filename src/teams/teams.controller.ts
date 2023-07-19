import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseGuards,
  Req,
  Res,
  Param,
  Body,
} from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get('/:id')
  async getTeamInformation(@Param('id') id: number) {
    return await this.teamsService.getTeamInformation(id);
  }

  @Get('/:id/users')
  async getTeamUsers(@Param('id') id: number) {
    return await this.teamsService.getTeamUsers(id);
  }

  @Put('/:id')
  async updateTeam(@Param('id') id: number, @Body() body) {
    return await this.teamsService.updateTeam(id, body);
  }

  @Put()
  async updateTeams() {
    return '';
  }

  @Get('test')
  async getTest() {
    return await this.teamsService.createTeamCode();
  }
}
