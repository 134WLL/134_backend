import { IsNotEmpty } from 'class-validator';

export class RegisterEditorRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  team_name: string;
}

export class RegisterGuestRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  team_code: string;
}
