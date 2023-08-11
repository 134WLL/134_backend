import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { User_Status } from '../entities/user_status.entity';
import { User_Notify } from '../entities/user_notify.entity';

@Injectable()
export class UserNotifiesRepository {
  constructor(
    @InjectRepository(User_Notify)
    private userNotifyRepository: Repository<User_Notify>,
  ) {}
  async save(options) {
    return await this.userNotifyRepository.save(options);
  }

  async find(options) {
    return await this.userNotifyRepository.find({ where: options });
  }

  async findOne(options) {
    return await this.userNotifyRepository.findOne({
      where: options,
    });
  }

  async findOneOption(options) {
    return await this.userNotifyRepository.findOne(options);
  }

  async update(id, options) {
    return await this.userNotifyRepository.update(id, options);
  }
}
