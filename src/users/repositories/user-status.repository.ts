import { Injectable } from '@nestjs/common';
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
}
