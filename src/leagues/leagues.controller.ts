import { BadRequestException, ForbiddenException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { LeaguesService } from './leagues.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) { }

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
}
