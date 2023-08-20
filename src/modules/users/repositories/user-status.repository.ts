import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { User_Status } from '../entities/user_status.entity';

@Injectable()
export class UserStatusRepository {
  constructor(
    @InjectRepository(User_Status)
    private userStatusRepository: Repository<User_Status>,
  ) {}
  async save(options) {
    return await this.userStatusRepository.save(options);
  }

  async find(options) {
    return await this.userStatusRepository.find({ where: options });
  }

  async findOne(options) {
    return await this.userStatusRepository.findOne({
      where: options,
    });
  }

  async findOneOption(options) {
    return await this.userStatusRepository.findOne(options);
  }

  async update(id, options) {
    return await this.userStatusRepository.update(id, options);
  }

  async query(options) {
    return await this.userStatusRepository.query(options);
  }

  async findUserStatusById(id: number) {
    try {
      return await this.userStatusRepository.query(`
      SELECT *
      FROM user_status
      WHERE user_id = ${id}
      `);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findUserStatusByDate(id: number, date) {
    try {
      return await this.userStatusRepository.query(`
      SELECT *
      FROM user_status
      WHERE user_id = ${id}
      AND check_date = '${date}'
      `);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findUserStatusByDateFormat(id: number) {
    try {
      return await this.userStatusRepository.query(`
      SELECT id, DATE_FORMAT(created_at, '%Y-%m-%d' ) AS reg_create_date
      FROM user_status
      WHERE user_id = ${id}`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findStateDataByDateFormat(report_id: number) {
    try {
      return await this.userStatusRepository.query(`
      SELECT id, energy, relation, stress, stable, conversation_count, DATE_FORMAT(created_at, '%Y-%m-%d' ) AS reg_create_date
      FROM user_status
      WHERE id = ${report_id}`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
