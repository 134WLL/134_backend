import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { KeywordsRepository } from './repositories/keywords.repository';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { QuestionsRepository } from './repositories/questions.repository';
import { ConversationsService } from '../conversations/conversations.service';

@Injectable()
export class KeywordsService {
  constructor(
    private readonly keywordsRepository: KeywordsRepository,
    private readonly questionsRepository: QuestionsRepository,
    @Inject(forwardRef(() => ConversationsService))
    private readonly conversationsService: ConversationsService,
  ) {}

  async createKeywordQuestion() {
    try {
      const keyword_data = JSON.parse(
        readFileSync('src/keywords/data/keyword.json', 'utf8'),
      );

      for (let i = 0; i < keyword_data.length; i++) {
        const findkeyword = await this.keywordsRepository.findOne({
          name: keyword_data[i].name,
        });
        if (findkeyword) {
        } else {
          const data = await this.keywordsRepository.save({
            name: keyword_data[i].name,
          });
          if (data) {
          } else {
          }
        }
      }
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async createQuestion() {
    const question_data = JSON.parse(
      readFileSync('src/keywords/data/question.json', 'utf8'),
    );

    question_data.forEach((e, i) => {
      e.forEach(async (e) => {
        const findKeyword = await this.keywordsRepository.findOne({
          name: e.name,
        });

        const findQuestionData = await this.questionsRepository.findOne({
          content: e.content,
        });

        if (findQuestionData) {
        } else {
          await this.questionsRepository.save({
            content: e.content,
            status_map: e.status_map,
            guide: e.guide,
            keyword: findKeyword.id,
            depth: e.depth,
          });
        }
      });
    });
  }

  async getKeywordQuestion(keyword_name: string, user_info, flag) {
    try {
      const find_keyword = await this.keywordsRepository.findOne({
        name: keyword_name,
      });

      let find_questions;

      if (!flag) {
        find_questions = await this.questionsRepository.query(`
      SELECT *
      FROM question
      WHERE keyword_id = ${find_keyword.id}
      AND status_map = ${user_info.state_code}`);
      } else {
        find_questions = await this.questionsRepository.query(`
      SELECT *
      FROM question
      WHERE keyword_id = ${find_keyword.id}`);
      }

      const random_value =
        find_questions[Math.floor(Math.random() * find_questions.length)];

      // const find_questions = await this.questionsRepository.findOptions({
      //   where: { keyword: find_keyword },
      // });

      // 조건 필요
      // 유저 이름
      // 처음 일 때는 최고 추천
      // 두번 째 일 때는 랜덤

      return { questions: random_value };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getQuestionEvery(keyword, question) {
    try {
      const find_keyword = await this.keywordsRepository.findOne({
        name: keyword,
      });
      const find_question = await this.questionsRepository.findOne({
        id: question,
      });

      return {
        keyword_id: find_keyword.id,
        keyword_name: find_keyword.name,
        question_id: find_question.id,
        question_content: find_question.content,
        depth: find_question.depth,
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getKeywords() {
    try {
      return await this.keywordsRepository.findOne({});
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getQuestion(options) {
    try {
      return await this.questionsRepository.findOne(options);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getQuestionOption(id: number) {
    try {
      // return await this.keywordsRepository.find({ id: 1 });
      return await this.keywordsRepository.findOptions({
        where: { id: id },
        relations: ['question'],
      });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
