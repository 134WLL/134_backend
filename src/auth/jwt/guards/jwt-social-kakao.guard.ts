import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtKakaoGuard extends AuthGuard('jwt-kakao') {}
