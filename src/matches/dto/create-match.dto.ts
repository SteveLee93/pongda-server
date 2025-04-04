import { IsArray, IsInt, IsPositive, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class MatchSetDto {
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

export class CreateMatchDto {
  @ApiProperty({ description: '시즌 리그 ID' })
  @IsNumber()
  seasonLeagueId: number;

  @IsInt()
  @ApiProperty({ description: '선수1 ID', example: 1 })
  player1Id: number;

  @IsInt()
  @ApiProperty({ description: '선수2 ID', example: 2 })
  player2Id: number;

  @IsArray()
  @ApiProperty({ description: '세트 정보', type: [MatchSetDto] })
  @ValidateNested({ each: true })
  @Type(() => MatchSetDto)
  sets: MatchSetDto[];
}
