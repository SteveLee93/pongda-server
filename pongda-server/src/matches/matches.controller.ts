import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Match } from './match.entity';
import { CreateQualifierMatchDto } from './dto/create-qualifier-match.dto';

@ApiTags('matches')
@ApiBearerAuth()
@Controller('matches')
export class MatchesController {
    constructor(private readonly matchesService: MatchesService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiOperation({ summary: '매치 생성', description: '새로운 매치를 생성합니다.' })
    async createMatch(@Body() dto: CreateMatchDto): Promise<Match> {
        return this.matchesService.create(dto);
    }   

    @Get()
    @ApiOperation({ summary: '모든 매치 조회', description: '모든 매치를 조회합니다.' })
    async getAllMatches() {
        return this.matchesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: '매치 조회', description: '매치를 조회합니다.' })
    async getMatchById(@Param('id', ParseIntPipe) id: number) {
        return this.matchesService.findOneById(id);
    }
    
    @Get('/users/:id')
    @ApiOperation({ summary: '유저 매치 조회', description: '유저의 매치를 조회합니다.' })
    async getMatchesByUser(@Param('id', ParseIntPipe) id: number) {
        return this.matchesService.findByUser(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('qualifier')
    @ApiOperation({ summary: '예선 매치 생성', description: '새로운 예선 매치를 생성합니다.' })
    async createQualifierMatch(@Body() dto: CreateQualifierMatchDto): Promise<Match> {
        return this.matchesService.createQualifierMatch(dto);
    }

    @Get('qualifier/:leagueId/:groupNumber/standings')
    @ApiOperation({ summary: '예선 순위 조회', description: '예선 그룹의 순위를 조회합니다.' })
    async getQualifierStandings(
        @Param('leagueId', ParseIntPipe) leagueId: number,
        @Param('groupNumber', ParseIntPipe) groupNumber: number
    ) {
        return this.matchesService.getQualifierStandings(leagueId, groupNumber);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':leagueId/generate-playoff')
    @ApiOperation({ summary: '본선 대진표 생성', description: '본선 대진표를 생성합니다.' })
    async generatePlayoffMatches(@Param('leagueId', ParseIntPipe) leagueId: number) {
        return this.matchesService.generatePlayoffMatches(leagueId);
    }
}
