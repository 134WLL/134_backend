import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { JwtAccessPayload } from './types/jwt-access.payload';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createTestUser(body, res: Response) {
    try {
      const { email } = body;
      let user = await this.usersService.findOneOption({
        where_option: { email: email },
        relation_option: [],
      }); //user를 찾아서

      if (!user) {
        user = await this.usersService.save({ email });
        // console.log(user);
        await this.usersService.userSave(user.id);
      }

      const tokens = await this.getTokens({
        uid: user.id,
        email: user.email,
        nickname: user.nickname,
        profile_image_url: user.profile_image_url,
      });

      await this.setCurrentRefreshToken(user.id, tokens.refresh_token);

      const find_user = await this.usersService.findOneOption({
        where_option: { email: user.email },
        relations_option: ['team', 'user_status', 'user_notify'],
      });

      let team_id = null;
      let team_code = null;
      if (find_user.team) {
        team_id = find_user.team.id;
        team_code = find_user.team.code;
      }

      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        domain: '134b.shop',
        sameSite: 'none',
        path: '/',
      });
      res.status(200).send({
        data: {
          token: {
            access_token: tokens.access_token,
          },
          user: {
            id: find_user.id,
            name: find_user.name,
            nickname: find_user.nickname,
            role: find_user.role,
            profile_image_url: find_user.profile_image_url,
            guide_confirm_date: find_user.user_notify.guide_confirm_date,
            team_id: team_id,
            team_code,
          },
        },
      });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async OAuthLogin({ req, res }) {
    try {
      let user = await this.usersService.findOneOption({
        where_option: { email: req.user.password },
        relation_option: [],
      }); //user를 찾아서

      if (!user) {
        user = await this.usersService.save({ email: req.user.password });
        // console.log(user);
        await this.usersService.userSave(user.id);
      }

      const tokens = await this.getTokens({
        uid: user.id,
        email: user.email,
        nickname: user.nickname,
        profile_image_url: user.profile_image_url,
      });

      await this.setCurrentRefreshToken(user.id, tokens.refresh_token);

      const find_user = await this.usersService.findOneOption({
        where_option: { email: user.email },
        relations_option: ['team', 'user_notify', 'user_status'],
      });

      let team_id = null;
      let team_code = null;
      if (find_user.team) {
        team_id = find_user.team.id;
        team_code = find_user.team.code;
      }

      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        domain: '134b.shop',
        sameSite: 'none',
        path: '/',
      });
      res.status(200).send({
        data: {
          token: { access_token: tokens.access_token },
          user: {
            id: find_user.id,
            name: find_user.name,
            nickname: find_user.nickname,
            role: find_user.role,
            profile_image_url: find_user.profile_image_url,
            guide_confirm_date: find_user.user_notify.guide_confirm_date,
            team_id: team_id,
            team_code,
          },
        },
      });
    } catch (err) {
      // console.log(err);
      throw new BadRequestException(err.response);
    }
  }

  async jwtSignOut(id: number) {
    try {
      await this.removeRefreshToken(id);
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

      await this.usersService.update(id, { hashed_refresh_token });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async checkRefreshTokens(id: number, refresh_token: string, res: Response) {
    try {
      const user = await this.usersService.findOne({ id });
      if (!user || !user.hashed_refresh_token) {
        throw new ForbiddenException('Access Denied');
      }

      const checkRefreshUser = await this.getUserIfRefreshTokenMatches(
        user.id,
        refresh_token,
      );

      if (!checkRefreshUser) {
        throw new ForbiddenException('Access Denied');
      }

      const payload = {
        uid: checkRefreshUser.id,
        email: checkRefreshUser.email,
        nickname: checkRefreshUser.nickname,
        profile_image_url: checkRefreshUser.profile_image_url,
      };

      const tokens = await this.getTokens(payload);
      await this.setCurrentRefreshToken(user.id, tokens.refresh_token);

      console.log('refresh tokne', { access_token: tokens.access_token });

      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        domain: '134b.shop',
        sameSite: 'none',
        path: '/',
      });
      res.status(200).send({ data: { access_token: tokens.access_token } });
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

  async removeRefreshToken(id: number) {
    try {
      return await this.usersService.update(id, {
        hashed_refresh_token: null,
      });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
