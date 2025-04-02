import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Match } from './match.entity';

@ApiTags('matches')
@ApiBearerAuth()
@Controller('matches')
export class MatchesController {
    constructor(private readonly matchesService: MatchesService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createMatch(@Body() dto: CreateMatchDto): Promise<Match> {
        return this.matchesService.create(dto);
    }   

    @Get()
    async getAllMatches() {
        return this.matchesService.findAll();
    }

    @Get(':id')
    async getMatchById(@Param('id', ParseIntPipe) id: number) {
        return this.matchesService.findOneById(id);
    }
    
    @Get('/users/:id')
    async getMatchesByUser(@Param('id', ParseIntPipe) id: number) {
        return this.matchesService.findByUser(id);
    }

    
}
