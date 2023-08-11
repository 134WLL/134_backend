import { IsNotEmpty } from 'class-validator';

export class KeywordRequestDto {
  @IsNotEmpty()
  keyword_array: string[];
}
