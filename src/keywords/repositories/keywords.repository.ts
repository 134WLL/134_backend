import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword } from '../entities/keyword.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KeywordsRepository {
  constructor(
    @InjectRepository(Keyword) private keywordRepository: Repository<Keyword>,
  ) {}

  async save(options) {
    return await this.keywordRepository.save(options);
  }

  async find(options) {
    return await this.keywordRepository.find({ where: options });
  }

  async findOptions(options) {
    return await this.keywordRepository.find(options);
  }

  async findOne(options) {
    return await this.keywordRepository.findOne({
      where: options,
    });
  }

  async update(id, options) {
    return await this.keywordRepository.update(id, options);
  }
}
