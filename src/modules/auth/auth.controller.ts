import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { IOAuthUser } from './interfaces/IOAuthUser.interface';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtKakaoGuard } from './jwt/guards/jwt-social-kakao.guard';
import { JwtAccessGuard } from './jwt/guards/jwt-access.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { JwtRefreshGuard } from './jwt/guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/signin/kakao')
  @UseGuards(JwtKakaoGuard)
  async signInKakao(@Req() req: Request & IOAuthUser) {}

  @Get('/kakao/callback')
  @UseGuards(JwtKakaoGuard)
  async signInCallback(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    return this.authService.OAuthLogin({ req, res });
  }

  @Post('/signout')
  @UseGuards(JwtAccessGuard)
  async signOut(@CurrentUser() user) {
    return this.authService.jwtSignOut(user.id);
  }

  @Get('/access-test')
  @UseGuards(JwtAccessGuard)
  async gestUser(@CurrentUser() user) {
    return user;
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  async getRefreshToken(@CurrentUser() data, @Res() res: Response) {
    const { user, refresh_token } = data;
    return await this.authService.checkRefreshTokens(
      user.id,
      refresh_token,
      res,
    );
  }

  @Post('/test-user')
  async createTestUser(@Body() body, @Res() res: Response) {
    return this.authService.createTestUser(body, res);
  }
}
