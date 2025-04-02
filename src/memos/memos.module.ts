import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemosService } from './memos.service';
import { MemosController } from './memos.controller';
import { Memo } from './memo.entity';
import { Match } from '../matches/match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Memo, Match])
  ],
  providers: [MemosService],
  controllers: [MemosController]
})
export class MemosModule {}
