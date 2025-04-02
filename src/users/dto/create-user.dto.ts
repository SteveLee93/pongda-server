import { IsEmail, IsString, Length, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '이메일', example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '닉네임', example: '닉네임' })
  @IsString()
  @Length(2, 30)
  nickname: string;

  @ApiProperty({ description: '비밀번호', example: '비밀번호' })
  @IsString()
  @Length(4, 100)
  password: string;

  @ApiProperty({ description: '역할', example: 'player' , enum: ['player', 'manager']})
  @IsIn(['player', 'manager'])
  role: string;
}