import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './jwt/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './jwt/strategies/jwt-refresh.strategy';
import { JwtKakaoStrategy } from './jwt/strategies/jwt-social-kakao.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({}),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtKakaoStrategy,
  ],
})
export class AuthModule {}
