import { IsEmail, IsString, Length, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(2, 30)
  nickname: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsIn(['player', 'manager'])
  role: string;
}