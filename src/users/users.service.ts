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

  async createUserNickname(id, name_code) {
    try {
      return await this.usersRepository.update(id, {
        nickname: name_code,
        profile_image_code: name_code,
      });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async updateUserNickname(id, name_code) {
    try {
      return await this.usersRepository.update(id, {
        nickname: name_code,
        profile_image_code: name_code,
      });
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
