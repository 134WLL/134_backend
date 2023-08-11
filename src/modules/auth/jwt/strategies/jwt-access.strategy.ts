import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtAccessPayload } from 'src/modules/auth/types/jwt-access.payload';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: JwtAccessSecretConstant.secret,
      secretOrKey: process.env.JWT_ACCESS_CONSTANT,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtAccessPayload) {
    const user_id = payload.uid;
    const user = await this.usersService.findOne({
      id: user_id,
    });

    if (user) {
      return user; // request.user
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
