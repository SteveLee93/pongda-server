import { IsDateString, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeagueDto {
  @ApiProperty({ description: '리그 이름', example: '리그 이름' })
  @IsString()
  @Length(2, 50)
  name: string;

  @ApiProperty({ description: '리그 설명', example: '리그 설명' })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiProperty({ description: '리그 시작일', example: '2025-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: '리그 종료일', example: '2025-01-01' })
  @IsDateString()
  endDate: string;
}