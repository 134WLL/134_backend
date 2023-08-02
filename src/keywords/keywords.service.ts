import { Injectable } from '@nestjs/common';
import { KeywordsRepository } from './repositories/keywords.repository';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { QuestionsRepository } from './repositories/questions.repository';

@Injectable()
export class KeywordsService {
  constructor(
    private readonly keywordsRepository: KeywordsRepository,
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  async createKeywordQuestion() {
    try {
      console.log(1);
      const keyword_data = JSON.parse(
        readFileSync('src/keywords/data/keyword.json', 'utf8'),
      );

      console.log(keyword_data);
      keyword_data.forEach(async (e) => {
        const findkeyword = await this.keywordsRepository.findOne({
          name: e.name,
        });
        if (findkeyword) {
          console.log(1);
        } else {
          console.log(2);
          const data = await this.keywordsRepository.save({ name: e.name });
          if (data) {
            console.log(data);
          } else {
            console.log(3);
          }
        }
      });

      // console.log(question_data);
    } catch (err) {
      console.log(err);
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
        console.log(findKeyword, i);
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

  async getKeywordQuestion(keyword_name: string) {
    try {
      const find_keyword = await this.keywordsRepository.findOne({
        name: keyword_name,
      });
      console.log(find_keyword);

      const find_questions = await this.questionsRepository.findOptions({
        where: { keyword: find_keyword },
      });

      // 조건 필요

      return { questions: find_questions[0] };

      console.log(find_questions);
    } catch (err) {
      console.log(err);
    }
  }

  async getQuestionEvery(keyword, question) {
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
  }

  async getKeywords() {
    try {
      return await this.keywordsRepository.findOne({});
    } catch (err) {
      console.log(err);
    }
  }

  async getQuestion() {
    try {
      return await this.questionsRepository.find({});
    } catch (err) {
      console.log(err);
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
      console.log(err);
    }
  }
}
