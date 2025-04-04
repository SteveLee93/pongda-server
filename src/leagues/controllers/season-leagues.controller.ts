import { Controller, Post, Body, Get, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SeasonLeaguesService } from 'src/leagues/services/season-leagues.service';
import { CreateSeasonLeagueDto } from 'src/leagues/dto/create-season-league.dto';

@Controller('season-leagues')
@ApiTags('Season Leagues')
export class SeasonLeaguesController {
  constructor(private readonly seasonLeaguesService: SeasonLeaguesService) {}

  @Post()
  @ApiOperation({ summary: '시즌 리그 생성', description: '새로운 시즌 리그를 생성합니다.' })
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateSeasonLeagueDto, @Req() req: any) {
    return this.seasonLeaguesService.create(dto, req.user);
  }

  @Get('parent/:parentId')
  @ApiOperation({ summary: '시즌 리그 목록', description: '특정 상위 리그의 모든 시즌 리그를 조회합니다.' })
  async findByParentLeague(@Param('parentId', ParseIntPipe) parentId: number) {
    return this.seasonLeaguesService.findByParentLeague(parentId);
  }

  // ... 기존의 다른 엔드포인트들 (참가자 관리, 예선/본선 관리 등)
}
