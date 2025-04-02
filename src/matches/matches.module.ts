import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { MatchSet } from './match-set.entity';
import { League } from 'src/leagues/league.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchSet, League, User])],
  providers: [MatchesService],
  controllers: [MatchesController],
})
export class MatchesModule {}
