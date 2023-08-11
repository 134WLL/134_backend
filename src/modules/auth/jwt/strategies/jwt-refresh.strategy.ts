import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAccessPayload } from 'src/modules/auth/types/jwt-access.payload';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token;
        },
      ]),
      // secretOrKey: JwtRefreshSecretConstant.secret,
      secretOrKey: process.env.JWT_REFRESH_CONSTANT,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtAccessPayload) {
    const refresh_token = req.cookies['refresh_token'];
    // const refresh_token = req.get('Authorization').replace('Bearer', '').trim();

    const user_id = payload.uid;
    const user = await this.usersService.findOne({
      id: user_id,
    });

    if (user) {
      return { user, refresh_token }; // request.user
    } else {
      // throw new BadRequestException('refresh ');
      throw new UnauthorizedException('refresh ');
    }
  }
}
