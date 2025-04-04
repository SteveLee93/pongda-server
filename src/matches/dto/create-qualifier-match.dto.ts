import { IsNumber, IsDateString, IsArray, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { MatchSetDto } from "./match-set.dto";

export class CreateQualifierMatchDto {
  @IsNumber()
  @ApiProperty({ description: '시즌 리그 ID' })
  seasonLeagueId: number;

  @IsNumber()
  @ApiProperty({ description: '예선 그룹 번호' })
  groupNumber: number;

  @IsNumber()
  @ApiProperty({ description: '선수1 ID' })
  player1Id: number;

  @IsNumber()
  @ApiProperty({ description: '선수2 ID' })
  player2Id: number;

  @IsDateString()
  @ApiProperty({ description: '경기 예정 일시' })
  scheduledDateTime: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchSetDto)
  sets: MatchSetDto[];
} 