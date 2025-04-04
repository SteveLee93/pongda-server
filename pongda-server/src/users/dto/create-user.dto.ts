import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: '사용자 이메일' })
  @IsEmail({}, { message: '유효한 이메일을 입력해주세요.' })
  email: string;

  @ApiProperty({ example: '닉네임', description: '사용자 닉네임' })
  @IsString()
  @MinLength(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' })
  nickname: string;

  @ApiProperty({ example: 'password123', description: '비밀번호' })
  @IsString()
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  password: string;

  @ApiProperty({ example: 'player', description: '사용자 역할', enum: ['player', 'manager'] })
  @IsOptional()
  @IsIn(['player', 'manager'], { message: '역할은 player 또는 manager여야 합니다.' })
  role?: string;
}