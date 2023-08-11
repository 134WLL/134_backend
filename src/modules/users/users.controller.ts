import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseGuards,
  Req,
  Res,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  RegisterGuestRequestDto,
  RegisterEditorRequestDto,
} from './dtos/register-request.dto';
import { RegisterNicknameDto } from './dtos/nickname-request.dto';
import { JwtAccessGuard } from 'src/modules/auth/jwt/guards/jwt-access.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/test')
  async getUsers() {
    return this.usersService.todayDate();
  }

  @Get('/:id/profile')
  @UseGuards(JwtAccessGuard)
  async getUserProfile(@CurrentUser() user, @Param('id') id: number) {
    return this.usersService.getUserProfile(user, id);
  }

  @Post('/:id/notify')
  @UseGuards(JwtAccessGuard)
  async postNotify(@CurrentUser() user) {
    return await this.usersService.updateNotify(user);
  }

  @Get('/:id')
  async getUser(@Param('id') id: number) {
    const options = {
      where: { id: id },
      relations: ['Team', 'User_Status', 'User_Notify'],
    };
    return await this.usersService.findOneOption(options);
  }

  @Post('/:id/register/editor')
  @UseGuards(JwtAccessGuard)
  async registerEditorUser(
    @Param('id') id: number,
    @CurrentUser() user,
    @Body() body: RegisterEditorRequestDto,
  ) {
    return await this.usersService.registerEditorUser(user.id, 'editor', body);
  }

  @Post('/:id/register/guest')
  @UseGuards(JwtAccessGuard)
  async registerGuestUser(
    @Param('id') id: number,
    @CurrentUser() user,
    @Body() body: RegisterGuestRequestDto,
  ) {
    return await this.usersService.registerGuestUser(user.id, 'guest', body);
  }

  @Post('/:id/nickname')
  @UseGuards(JwtAccessGuard)
  async createUserNickname(
    @Param('id') id: number,
    @Body() nicknameCodes: RegisterNicknameDto,
    @Res() res: Response,
  ) {
    return await this.usersService.createUserNickname(id, nicknameCodes, res);
  }

  @Put('/:id/nickname')
  @UseGuards(JwtAccessGuard)
  async updateUserNickname(
    @Param('id') id: number,
    @Body() nicknameCodes: RegisterNicknameDto,
    @Res() res: Response,
  ) {
    return await this.usersService.updateUserNickname(id, nicknameCodes, res);
  }
}
