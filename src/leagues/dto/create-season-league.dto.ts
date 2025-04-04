import { IsDateString, IsOptional, IsString, Length, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MatchFormat, GameType, TournamentFormat } from 'src/leagues/enums/league.enum';

export class CreateSeasonLeagueDto {
  @ApiProperty({ description: '리그 이름' })
  @IsString()
  @Length(2, 50)
  name: string;

  @ApiProperty({ description: '리그 설명' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '시즌 정보' })
  @IsString()
  seasonInfo: string;

  @ApiProperty({ description: '상위 리그 ID' })
  @IsNumber()
  parentLeagueId: number;

  @ApiProperty({ description: '승리 조건', enum: MatchFormat })
  @IsEnum(MatchFormat)
  @IsOptional()
  matchFormat?: MatchFormat;

  @ApiProperty({ description: '경기 방식', enum: GameType })
  @IsEnum(GameType)
  @IsOptional()
  gameType?: GameType;

  @ApiProperty({ description: '시작 날짜 및 시간' })
  @IsDateString()
  startDateTime: string;

  @ApiProperty({ description: '예선 방식', enum: TournamentFormat })
  @IsEnum(TournamentFormat)
  @IsOptional()
  qualifierFormat?: TournamentFormat;

  @ApiProperty({ description: '본선 방식', enum: TournamentFormat })
  @IsEnum(TournamentFormat)
  @IsOptional()
  playoffFormat?: TournamentFormat;
}
