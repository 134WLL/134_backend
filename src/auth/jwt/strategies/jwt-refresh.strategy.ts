import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtRefreshSecretConstant } from 'src/auth/constants/jwt-refresh-secret.constant';
import { UsersService } from 'src/users/users.service';
import { JwtRefreshPayload } from 'src/auth/types/jwt-refresh.payload';
import { JwtAccessPayload } from 'src/auth/types/jwt-access.payload';

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
          // console.log(request);

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
    console.log(refresh_token);
    console.log(payload);
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
