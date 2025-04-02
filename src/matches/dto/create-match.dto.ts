import { IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MatchSetDto {
  @IsInt()
  setNumber: number;

  @IsInt()
  @IsPositive()
  scorePlayer1: number;

  @IsInt()
  @IsPositive()
  scorePlayer2: number;
}

export class CreateMatchDto {
  @IsInt()
  leagueId: number;

  @IsInt()
  player1Id: number;

  @IsInt()
  player2Id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchSetDto)
  sets: MatchSetDto[];
}
