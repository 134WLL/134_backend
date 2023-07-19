import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { JwtAccessPayload } from './types/jwt-access.payload';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async OAuthLogin({ req }) {
    try {
      const { email } = req.user;
      console.log(email);
      let user = await this.usersService.findOne({ email: req.user.email }); //user를 찾아서

      if (!user) {
        user = await this.usersService.save({ email });
      }

      const tokens = await this.getTokens({
        uid: user.id,
        email: user.email,
        nickname: user.nickname,
        profile_image_code: user.profile_image_code,
      });

      await this.setCurrentRefreshToken(user.id, tokens.refresh_token);

      return tokens;

      // this.setRefreshToken({ user, res });
      // return res.redirect('리다이렉트할 url주소');
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getTokens(payload: JwtAccessPayload) {
    try {
      const [access_token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_ACCESS_CONSTANT,
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        }),
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_REFRESH_CONSTANT,
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        }),
      ]);

      return { access_token, refresh_token };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async setCurrentRefreshToken(id, refresh_token) {
    try {
      const salt = await bcrypt.genSalt();
      const hashed_refresh_token = await bcrypt.hash(refresh_token, salt);

      await this.usersService.update({ id }, { hashed_refresh_token });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async checkRefreshTokens(id: number, refreshToken: string) {
    try {
      const user = await this.usersService.findOne({ id });
      if (!user || !user.hashed_refresh_token) {
        throw new ForbiddenException('Access Denied');
      }

      const checkRefreshUser = await this.getUserIfRefreshTokenMatches(
        user.id,
        refreshToken,
      );

      if (!checkRefreshUser) {
        throw new ForbiddenException('Access Denied');
      }

      const payload = {
        uid: checkRefreshUser.id,
        email: checkRefreshUser.email,
        nickname: checkRefreshUser.nickname,
      };
      const tokens = await this.getTokens(payload);

      await this.setCurrentRefreshToken(user.id, tokens.refresh_token);

      return { tokens };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getUserIfRefreshTokenMatches(id, refreshToken) {
    try {
      const user = await this.usersService.findOne({ id });

      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.hashed_refresh_token,
      );

      if (!isRefreshTokenMatching) {
        return null;
      }

      return user;
    } catch (err) {}
  }

  async jwtSignOut(id: number) {
    try {
      await this.removeRefreshToken(id);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async removeRefreshToken(id: number) {
    try {
      return await this.usersService.update(
        { id },
        {
          hashed_refresh_token: null,
        },
      );
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
