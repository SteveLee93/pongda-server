import { Controller, Post, Get, Req, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MemosService } from './memos.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('matches/:id/memo')
@UseGuards(AuthGuard('jwt'))
export class MemosController {
  constructor(private readonly memosService: MemosService) {}

  @Post()
  async saveMemo(
    @Req() req,
    @Param('id', ParseIntPipe) matchId: number,
    @Body('content') content: string,
  ) {
    return this.memosService.saveMemo(req.user.userId, matchId, content);
  }

  @Get()
  async getMyMemo(@Req() req, @Param('id', ParseIntPipe) matchId: number) {
    return this.memosService.getMyMemo(req.user.userId, matchId);
  }
}
