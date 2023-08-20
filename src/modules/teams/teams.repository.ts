import { BadRequestException, Injectable } from '@nestjs/common';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TeamsRepository {
  constructor(
    @InjectRepository(Team) private teamRepository: Repository<Team>,
  ) {}

  async save(options) {
    return await this.teamRepository.save(options);
  }

  async find(options) {
    return await this.teamRepository.find({ where: options });
  }

  async query(options) {
    return await this.teamRepository.query(options);
  }

  async findOne(options) {
    return await this.teamRepository.findOne({
      where: options,
    });
  }

  async findOneOption(options) {
    const { where_option, relaitions_option } = options;
    return await this.teamRepository.findOne({
      where: where_option,
      relations: relaitions_option,
    });
  }

  async update(id, options) {
    return await this.teamRepository.update(id, options);
  }

  async findTeamWithUser(id: number) {
    try {
      return await this.teamRepository.query(`
      SELECT user.id, user.nickname, user.name, user.profile_image_url
      FROM team
        INNER JOIN user
        ON user.team_id = ${id}
      WHERE team.id = ${id}`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findTeamConversationRoomByProgress(id: number) {
    try {
      return await this.teamRepository.query(`
      SELECT conversation_room.name, conversation_room.id AS conversation_room_id, conversation_room.state_flag AS conversation_flag 
      FROM team
        INNER JOIN conversation_room
        ON conversation_room.team_id =${id}
      WHERE team.id = ${id}
      AND conversation_room.progress_flag = true`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
