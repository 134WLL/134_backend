import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { TeamsRepository } from './teams.repository';
import * as bcrypt from 'bcrypt';
import { ConversationsService } from 'src/conversations/conversations.service';

@Injectable()
export class TeamsService {
  constructor(
    private readonly teamsRepository: TeamsRepository,
    @Inject(forwardRef(() => ConversationsService))
    private readonly converationsService: ConversationsService,
  ) {}

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

  async createTeamConversation(id: number, body) {
    try {
      const find_team = await this.teamsRepository.findOne({ id });
      if (!find_team) {
        throw new ForbiddenException('Access Denied');
      }

      this.converationsService.createRoom(find_team, body);
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
