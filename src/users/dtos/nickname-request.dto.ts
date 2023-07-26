import { IsNotEmpty } from 'class-validator';

export class RegisterNicknameDto {
  @IsNotEmpty()
  emotion_code: number;

  @IsNotEmpty()
  action_code: number;

  @IsNotEmpty()
  state_code: number;
}
