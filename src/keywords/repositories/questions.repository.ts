import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../entities/question.entity';
import { Repository } from 'typeorm';

type NewType = Question;

@Injectable()
export class QuestionsRepository {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<NewType>,
  ) {}
  async save(options) {
    return await this.questionRepository.save(options);
  }

  async find(options) {
    return await this.questionRepository.find({ where: options });
  }

  async findOptions(options) {
    return await this.questionRepository.find(options);
  }

  async findOne(options) {
    return await this.questionRepository.findOne({
      where: options,
    });
  }

  async update(id, options) {
    return await this.questionRepository.update(id, options);
  }
}
