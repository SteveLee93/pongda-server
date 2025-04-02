import { Controller, Post, Get, Req, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MemosService } from './memos.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Memos')
@ApiBearerAuth()
@Controller('matches/:id/memo')
@UseGuards(AuthGuard('jwt'))
export class MemosController {
  constructor(private readonly memosService: MemosService) {}

  @Post()
  @ApiOperation({ summary: '메모 저장', description: '메모를 저장합니다.' })
  async saveMemo(
    @Req() req,
    @Param('id', ParseIntPipe) matchId: number,
    @Body('content') content: string,
  ) {
    return this.memosService.saveMemo(req.user.userId, matchId, content);
  }

  @Get()
  @ApiOperation({ summary: '내 메모 조회', description: '내 메모를 조회합니다.' })
  async getMyMemo(@Req() req, @Param('id', ParseIntPipe) matchId: number) {
    return this.memosService.getMyMemo(req.user.userId, matchId);
  }
}
