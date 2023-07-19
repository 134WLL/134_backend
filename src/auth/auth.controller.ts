import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { IOAuthUser } from './interfaces/IOAuthUser.interface';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtKakaoGuard } from './jwt/guards/jwt-social-kakao.guard';
import { JwtAccessGuard } from './jwt/guards/jwt-access.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async test() {
    const a = process.env.JWT_ACCESS_CONSTANT;
    const b = process.env.JWT_REFRESH_CONSTANT;
    return { a, b };
  }

  @Get('/signin/kakao')
  @UseGuards(JwtKakaoGuard)
  async signInKakao(@Req() req: Request & IOAuthUser, @Res() res: Response) {}

  @Get('/kakao/callback')
  @UseGuards(JwtKakaoGuard)
  async signInCallback(@Req() req: Request & IOAuthUser) {
    // console.log(req);
    return this.authService.OAuthLogin({ req });
  }

  @Post('/signout')
  @UseGuards(JwtAccessGuard)
  async signOut(@Req() req: Request) {
    const id = 1;
    return this.authService.jwtSignOut(id);
  }

  @Post('/refresh')
  async getRefreshToken() {
    return '';
  }
}
