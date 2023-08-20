import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async save(options) {
    return await this.userRepository.save(options);
  }

  async find(options) {
    return await this.userRepository.find({ where: options });
  }

  async findOne(options) {
    return await this.userRepository.findOne({
      where: options,
    });
  }

  async findOneOption(options) {
    const { where_option, relations_option } = options;

    return await this.userRepository.findOne({
      where: where_option,
      relations: relations_option,
    });
  }

  async update(id, options) {
    return await this.userRepository.update(id, options);
  }

  async query(options) {
    return await this.userRepository.query(options);
  }

  async findUsersByTeam(team_id: number) {
    try {
      return await this.userRepository.query(`
      SELECT *
      FROM user
      WHERE team_id = ${team_id}`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findUsersBySearchName(team_id, name) {
    try {
      return await this.userRepository.query(`
      (SELECT *
      FROM user
      WHERE team_id = ${team_id}
      AND name like '%${name}%')
      UNION DISTINCT
      (SELECT *
      FROM user
      WHERE team_id = ${team_id}
      AND nickname like '%${name}%')`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findUsersCodeData(team_id) {
    try {
      return await this.userRepository.query(`
      SELECT emotion_code,action_code,state_code
      FROM user
      WHERE team_id = ${team_id}`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
