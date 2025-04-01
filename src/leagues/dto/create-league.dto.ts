import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateLeagueDto {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}