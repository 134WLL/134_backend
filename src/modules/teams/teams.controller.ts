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
  Query,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAccessGuard } from 'src/modules/auth/jwt/guards/jwt-access.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get('/:id')
  async getTeamInformation(@Param('id') id: number) {
    return await this.teamsService.getTeamInformation(id);
  }

  @Get('/:id/timeout')
  async getTeamTimeout(@Param('id') id: number) {
    return await this.teamsService.getTeamTimeout(id);
  }

  @Get('/:id/users')
  async getTeamUsers(@Param('id') id: number) {
    return await this.teamsService.getTeamUsers(id);
  }

  @Post('/:id/conversation-room')
  async createConversation(@Param('id') id: number, @Body() body) {
    return await this.teamsService.createTeamConversation(id, body);
  }

  @Get('/:id/conversation-rooms/search')
  @UseGuards(JwtAccessGuard)
  async getSerachonversationRooms(
    @CurrentUser() userInfo,
    @Param('id') id: number,
    @Query('name') name: string,
  ) {
    return await this.teamsService.getSearchTeamConversationRooms(
      userInfo,
      id,
      name,
    );
  }

  @Get('/:id/conversation-rooms')
  @UseGuards(JwtAccessGuard)
  async getConversationRooms(@CurrentUser() userInfo, @Param('id') id: number) {
    return await this.teamsService.getTeamConversationRooms(userInfo, id);
  }

  //

  @Put('/:id')
  async updateTeam(@Param('id') id: number, @Body() body) {
    return await this.teamsService.updateTeam(id, body);
  }

  @Get('test')
  async getTest() {
    return await this.teamsService.createTeamCode();
  }
}
