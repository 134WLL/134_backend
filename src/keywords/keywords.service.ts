import { Injectable } from '@nestjs/common';
import { KeywordsRepository } from './keywords.repository';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class KeywordsService {
  constructor(private readonly keywordsRepository: KeywordsRepository) {}

  async createKeywordQuestion() {
    try {
      const keyword_data = JSON.parse(
        readFileSync('src/keywords/data/keyword.json', 'utf8'),
      );

      const question_data = JSON.parse(
        readFileSync('src/keywords/data/question.json', 'utf8'),
      );
      //   console.log(question_data);
    } catch (err) {
      console.log(err);
    }

    // const file = createReadStream(join(process.cwd(), './data/keyword.json'));
  }
}
