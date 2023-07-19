import { Injectable } from '@nestjs/common';
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

  async findOne(options) {
    return await this.teamRepository.findOne({
      where: options,
    });
  }

  async update(id, options) {
    return await this.teamRepository.update(id, options);
  }
}