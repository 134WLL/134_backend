import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import {
  RegisterEditorRequestDto,
  RegisterGuestRequestDto,
} from './dtos/register-request.dto';

import { RegisterNicknameDto } from './dtos/nickname-request.dto';
import { UserNotifiesRepository } from './repositories/user-notifies.repository';
import { UserStatusRepository } from './repositories/user-status.repository';
import e, { Response } from 'express';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usernotifesRepository: UserNotifiesRepository,
    private readonly userStatusRepository: UserStatusRepository,
    @Inject(forwardRef(() => TeamsService))
    private readonly teamsService: TeamsService,
  ) {}

  async registerEditorUser(
    user_id: number,
    role: string,
    body: RegisterEditorRequestDto,
  ) {
    try {
      const { name, team_name } = body;

      const new_team = await this.teamsService.createTeam(user_id, team_name);

      const user = await this.usersRepository.update(user_id, {
        name,
        role,
        team: new_team.id,
      });

      return { team_code: new_team.code, team_id: new_team.id, role: 'editor' };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async registerGuestUser(
    user_id: number,
    role: string,
    body: RegisterGuestRequestDto,
  ) {
    try {
      const { name, team_code } = body;

      const team = await this.teamsService.joinTeam(team_code);

      await this.usersRepository.update(user_id, {
        name,
        team: team.id,
      });
      return { team_id: team.id, role: 'guest' };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async createUserNickname(
    id: number,
    name_code: RegisterNicknameDto,
    res: Response,
  ) {
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

      await this.usersRepository.update(id, {
        nickname: new_nickname,
        emotion_code,
        action_code,
        state_code,
        profile_image_url: profile_image_url,
      });
      const find_user = await this.usersRepository.findOne({ id });
      res.status(201).send({
        data: {
          nickname: find_user.nickname,
          profile_image_url: find_user.profile_image_url,
        },
      });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async updateUserNickname(
    id: number,
    name_code: RegisterNicknameDto,
    res: Response,
  ) {
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

      await this.usersRepository.update(id, {
        nickname: new_nickname,
        emotion_code,
        action_code,
        state_code,
        profile_image_url: profile_image_url,
      });

      const find_user = await this.usersRepository.findOne({ id });
      res.status(201).send({
        data: {
          nickname: find_user.nickname,
          profile_image_url: find_user.profile_image_url,
        },
      });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getEmotionNickname(code: number) {
    try {
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
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getActionNickname(code: number) {
    try {
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
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getStateNickname(code: number) {
    try {
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
    } catch (err) {
      throw new BadRequestException(err.response);
    }
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
      throw new BadRequestException(err.response);
    }
  }

  async findOneOption(options) {
    try {
      const user = await this.usersRepository.findOneOption(options);
      if (user) {
        return user;
      }
      return null;
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async userSave(user_id: number) {
    try {
      await this.usernotifesRepository.save({ user: user_id });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async save(options) {
    try {
      return await this.usersRepository.save(options);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async update(id, options) {
    try {
      return await this.usersRepository.update(id, options);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getUserProfile(user, id) {
    try {
      return {
        profile_image_url: user.profile_image_url,
        name: user.name,
        nickname: user.nickname,
        name_code: {
          emotion_code: user.emotion_code,
          action_code: user.action_code,
          state_code: user.state_code,
        },
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async updateNotify(user) {
    try {
      const find_user = await this.usersRepository.findOneOption({
        where_option: { id: user.id },
        relations_option: ['user_notify'],
      });

      const date = this.todayDate();

      await this.usernotifesRepository.update(find_user.user_notify.id, {
        guide_confirm_date: date,
      });

      return { guide_confirm_date: date };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  todayDate() {
    const curr = new Date();

    // 2. UTC 시간 계산
    const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;

    // 3. UTC to KST (UTC + 9시간)
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000; //한국 시간(KST)은 UTC시간보다 9시간 더 빠르므로 9시간을 밀리초 단위로 변환.
    const kr_curr = new Date(utc + KR_TIME_DIFF); //UTC 시간을 한국 시간으로 변환하기 위해 utc 밀리초 값에 9시간을 더함.

    const year = kr_curr.getFullYear();
    const month = kr_curr.getMonth() + 1;
    const day = kr_curr.getDate();
    return `${year}-${month}-${day}`;
  }

  async postFeedback(user, body, new_date) {
    try {
      const {
        conversation_room_id,
        conversation_user_id,
        status_energy,
        status_relation,
        status_stress,
        status_stable,
      } = body;
      await this.userStatusRepository.save({
        energy: status_energy,
        relation: status_relation,
        stress: status_stress,
        stable: status_stable,
        check_date: new_date,
        user: user.id,
      });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async putFeedback(id, user, body) {
    try {
      const {
        conversation_room_id,
        conversation_user_id,
        status_energy,
        status_relation,
        status_stress,
        status_stable,
      } = body;

      await this.userStatusRepository.update(id, {
        energy: status_energy,
        relation: status_relation,
        stress: status_stress,
        stable: status_stable,
        conversation_count: () => `conversation_count +1`,
      });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  // 수정 필요 날짜 갱신
  async getFeedback(user) {
    try {
      const new_date = this.todayDate();

      const [status] = await this.userStatusRepository.findUserStatusByDate(
        user.id,
        new_date,
      );

      if (!status) {
        return null;
      }
      return { status };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getStatisticCharater(user_info, team_id) {
    try {
      return await this.usersRepository.findUsersCodeData(team_id);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getUserFeedback(team_id) {
    try {
      const team_users = await this.usersRepository.findUsersByTeam(team_id);

      const users_data = [];
      await Promise.all(
        team_users.map(async (user) => {
          const status_data =
            await this.userStatusRepository.findUserStatusById(user.id);
          status_data.forEach((status) => {
            if (status) {
              users_data.push(status);
            }
          });
        }),
      );
      return users_data;
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getUserLog(user_info, team_id) {
    try {
      const users_data = await this.usersRepository.findUsersByTeam(team_id);

      await Promise.all(
        users_data.map(async (user) => {
          const find_status =
            await this.userStatusRepository.findUserStatusById(user.id);

          user.status_array = [];
          find_status.forEach((status) => {
            user.status_array.push(status);
          });
        }),
      );

      return users_data;
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getUserSearchLog(user_info, team_id, name) {
    try {
      const users_data = await this.usersRepository.findUsersBySearchName(
        team_id,
        name,
      );

      await Promise.all(
        users_data.map(async (user) => {
          const find_status =
            await this.userStatusRepository.findUserStatusById(user.id);

          user.status_array = [];
          find_status.forEach((status) => {
            user.status_array.push(status);
          });
        }),
      );

      return users_data;
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getUserReport(user_info, id) {
    try {
      return await this.userStatusRepository.findUserStatusByDateFormat(id);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getUserReportDetail(user_info, id, report_id) {
    try {
      const [user_report] =
        await this.userStatusRepository.findStateDataByDateFormat(report_id);

      return user_report;
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getUserReports(user_info, id) {
    try {
      return await this.userStatusRepository.findUserStatusById(id);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
