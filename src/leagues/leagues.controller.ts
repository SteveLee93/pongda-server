import { BadRequestException, ForbiddenException, Body, Controller, Post, Req, UseGuards, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { LeaguesService } from './leagues.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Controller('leagues')
export class LeaguesController {
  constructor(
    private readonly leaguesService: LeaguesService,
    private readonly usersService: UsersService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
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
  async getAll() {
    return this.leaguesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/join')
  async join(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const user = await this.usersService.findOne(req.user.userId);
    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }
    return this.leaguesService.joinLeague(id, user);
  }

  @Get(':id/users')
  async getParticipants(@Param('id', ParseIntPipe) id: number) {
    return this.leaguesService.getParticipants(id);
  }
} 
