import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { TeamsRepository } from './teams.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeamsService {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async createTeam(id, team_name) {
    const { random_code, hashed_random_code } = await this.createTeamCode();
    const team = await this.teamsRepository.save({
      editor_id: id,
      company: team_name,
      code: random_code,
      hashed_code: hashed_random_code,
    });
    return team;
  }

  async createTeamCode() {
    try {
      const random_code = Math.random().toString(36).substring(2, 11);

      const salt = await bcrypt.genSalt();
      const hashed_random_code = await bcrypt.hash(random_code, salt);
      return { random_code, hashed_random_code };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async joinTeam(team_code) {
    try {
      const team = await this.teamsRepository.findOne({ team_code });
      if (!team) {
        throw new ForbiddenException('Access Denied');
      }
      return team;
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async updateTeamCode() {}

  async checkTeamCode() {}

  async getTeamInformation(id: number) {
    try {
      await this.teamsRepository.findOne({ id });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getTeamUsers(id) {
    try {
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async updateTeam(id, body) {
    try {
      return await this.teamsRepository.update(id, body);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  //  @Column()
  //   company: string;

  //   @Column()
  //   editor_id: number;

  //   @Column()
  //   hashed_code: string;
}
