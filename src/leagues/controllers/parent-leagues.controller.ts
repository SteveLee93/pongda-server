import { Controller, Post, Get, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ParentLeaguesService } from 'src/leagues/services/parent-leagues.service';
import { CreateParentLeagueDto } from 'src/leagues/dto/create-parent-league.dto';

@Controller('parent-leagues')
@ApiTags('Parent Leagues')
export class ParentLeaguesController {
  constructor(private readonly parentLeaguesService: ParentLeaguesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '상위 리그 생성', description: '새로운 상위 리그를 생성합니다.' })
  async create(@Body() dto: CreateParentLeagueDto, @Req() req: any) {
    return this.parentLeaguesService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: '상위 리그 목록', description: '모든 상위 리그를 조회합니다.' })
  async findAll() {
    return this.parentLeaguesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '상위 리그 조회', description: '특정 상위 리그의 정보를 조회합니다.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parentLeaguesService.findOne(id);
  }
}
