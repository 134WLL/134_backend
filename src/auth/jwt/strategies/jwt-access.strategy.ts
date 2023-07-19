import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtAccessSecretConstant } from 'src/auth/constants/jwt-access-secret.constant';
import { UsersService } from 'src/users/users.service';
import { JwtAccessPayload } from 'src/auth/types/jwt-access.payload';

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
