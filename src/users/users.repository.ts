import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

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

  async update(id, options) {
    return await this.userRepository.update(id, options);
  }
}
