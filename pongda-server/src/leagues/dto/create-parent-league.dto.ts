import { IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParentLeagueDto {
  @ApiProperty({ description: '리그 이름' })
  @IsString()
  @Length(2, 50)
  name: string;

  @ApiProperty({ description: '리그 설명' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '시/도', example: '인천시' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: '구/군', example: '부평구' })
  @IsString()
  @IsOptional()
  district?: string;
}
