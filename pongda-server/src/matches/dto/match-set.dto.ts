import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MatchSetDto {
  @IsInt()
  @ApiProperty({ description: '세트 번호', example: 1 })
  setNumber: number;

  @IsInt()
  @ApiProperty({ description: '선수1 점수', example: 11 })
  @IsPositive()
  scorePlayer1: number;

  @IsInt()
  @ApiProperty({ description: '선수2 점수', example: 11 })
  @IsPositive()
  scorePlayer2: number;
} 