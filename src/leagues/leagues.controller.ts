import { BadRequestException, ForbiddenException, Body, Controller, Post, Req, UseGuards, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { LeaguesService } from './leagues.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Leagues')
@Controller('leagues')
export class LeaguesController {
  constructor(
    private readonly leaguesService: LeaguesService,
    private readonly usersService: UsersService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '리그 생성', description: '새로운 리그를 생성합니다.' })
  async create(@Body() dto: CreateLeagueDto, @Req() req: any) {
    console.log('User object:', req.user);
    try {
      return await this.leaguesService.create(dto, req.user);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: '모든 리그 조회', description: '모든 리그를 조회합니다.' })
  async getAll() {
    return this.leaguesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/join')
  @ApiOperation({ summary: '리그 참여', description: '리그에 참여합니다.' })
  async join(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const user = await this.usersService.findOne(req.user.userId);
    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }
    return this.leaguesService.joinLeague(id, user);
  }

  @Get(':id/users')
  @ApiOperation({ summary: '리그 참여자 조회', description: '리그의 참여자를 조회합니다.' })
  async getParticipants(@Param('id', ParseIntPipe) id: number) {
    return this.leaguesService.getParticipants(id);
  }
} 
