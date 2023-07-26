import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import {
  RegisterEditorRequestDto,
  RegisterGuestRequestDto,
} from './dtos/register-request.dto';
import { UserRole } from './types/user-role.type';
import { TeamsService } from 'src/teams/teams.service';
import { RegisterNicknameDto } from './dtos/nickname-request.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly teamsService: TeamsService,
  ) {}

  async registerEditorUser(
    id: number,
    role: string,
    body: RegisterEditorRequestDto,
  ) {
    try {
      const { name, team_name } = body;
      const [user, team] = await Promise.all([
        this.usersRepository.update(id, { name, role }),
        this.teamsService.createTeam(id, team_name),
      ]);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async registerGuestUser(
    id: number,
    role: string,
    body: RegisterGuestRequestDto,
  ) {
    try {
      const { name, team_code } = body;

      const team = await this.teamsService.joinTeam(team_code);

      const user = await this.usersRepository.update(id, {
        name,
        team_id: team.id,
      });

      return user;
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async createUserNickname(id: number, name_code: RegisterNicknameDto) {
    try {
      const { emotion_code, action_code, state_code } = name_code;

      const [emotion, action, state] = await Promise.all([
        this.getEmotionNickname(emotion_code),
        this.getActionNickname(action_code),
        this.getStateNickname(state_code),
      ]);

      const new_nickname = `${emotion.emotion_nickname} ${action.action_nickname}의 ${state.state_nickname}`;
      const image_code = `${emotion.emotion_codename}-${action.action_codename}-${state.state_codename}`;
      const profile_image_url = `${process.env.PROFILE_S3_URL}${image_code}.png`;

      return await this.usersRepository.update(id, {
        nickname: new_nickname,
        emotion_code,
        action_code,
        state_code,
        profile_image_url: profile_image_url,
      });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async updateUserNickname(id: number, name_code: RegisterNicknameDto) {
    try {
      const { emotion_code, action_code, state_code } = name_code;

      const [emotion, action, state] = await Promise.all([
        this.getEmotionNickname(emotion_code),
        this.getActionNickname(action_code),
        this.getStateNickname(state_code),
      ]);

      const new_nickname = `${emotion.emotion_nickname} ${action.action_nickname}의 ${state.state_nickname}`;
      const image_code = `${emotion.emotion_codename}-${action.action_codename}-${state.state_codename}`;
      const profile_image_url = `${process.env.PROFILE_S3_URL}${image_code}.png`;

      return await this.usersRepository.update(id, {
        nickname: new_nickname,
        emotion_code,
        action_code,
        state_code,
        profile_image_url: profile_image_url,
      });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getEmotionNickname(code: number) {
    let emotion_nickname;
    let emotion_codename;
    if (code === 1) {
      emotion_nickname = '떠오르는';
      emotion_codename = 'fl';
    } else if (code === 2) {
      emotion_nickname = '차가운';
      emotion_codename = 'co';
    } else if (code === 3) {
      emotion_nickname = '붉은';
      emotion_codename = 're';
    } else if (code === 4) {
      emotion_nickname = '들썩이는';
      emotion_codename = 'up';
    } else if (code === 5) {
      emotion_nickname = '노래하는';
      emotion_codename = 'si';
    }
    return { emotion_nickname, emotion_codename };
  }

  async getActionNickname(code: number) {
    let action_nickname: string;
    let action_codename: string;
    if (code === 1) {
      action_nickname = '나무';
      action_codename = 't';
    } else if (code === 2) {
      action_nickname = '황소';
      action_codename = 'w';
    } else if (code === 3) {
      action_nickname = '매';
      action_codename = 'a';
    } else if (code === 4) {
      action_nickname = '바람';
      action_codename = 'd';
    } else if (code === 5) {
      action_nickname = '바위';
      action_codename = 'r';
    }
    return { action_nickname, action_codename };
  }

  async getStateNickname(code: number) {
    let state_nickname: string;
    let state_codename: string;
    if (code === 1) {
      state_nickname = '날개짓';
      state_codename = 'ng';
    } else if (code === 2) {
      state_nickname = '낮잠';
      state_codename = 'sp';
    } else if (code === 3) {
      state_nickname = '손';
      state_codename = 'ha';
    } else if (code === 4) {
      state_nickname = '열매';
      state_codename = 'fu';
    } else if (code === 5) {
      state_nickname = '일격';
      state_codename = 'bl';
    }
    return { state_nickname, state_codename };
  }

  async find(options) {
    return this.usersRepository.find(options);
  }

  async findOne(options): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne(options);
      if (user) {
        return user;
      }
      return null;
    } catch (err) {
      console.log(err);
    }
  }

  async save(options) {
    try {
      return await this.usersRepository.save(options);
    } catch (err) {
      console.log(err);
    }
  }

  async update(id, options) {
    try {
    } catch (err) {
      console.log(err);
    }
  }
}
