import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Match } from 'src/matches/match.entity';
import { Memo } from 'src/memos/memo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Match, Memo])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }