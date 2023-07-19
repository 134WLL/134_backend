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
import { UserRole } from './types/user-role.type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/:id/register/editor')
  async registerEditorUser(
    @Param('id') id: number,
    @Body() body: RegisterEditorRequestDto,
  ) {
    return await this.usersService.registerEditorUser(id, 'editor', body);
  }

  @Post('/:id/register/guest')
  async registerGuestUser(
    @Param('id') id: number,
    @Body() body: RegisterGuestRequestDto,
  ) {
    return await this.usersService.registerGuestUser(id, 'guest', body);
  }

  @Post('/:id/nickname')
  async createUserNickname(@Param('id') id: number, @Body() name_code: number) {
    return await this.usersService.createUserNickname(id, name_code);
  }

  @Put('/:id/nickname')
  async updateUserNickname(@Param('id') id: number, @Body() name_code: number) {
    return await this.usersService.updateUserNickname(id, name_code);
  }
}
