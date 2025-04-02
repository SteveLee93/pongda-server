import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { MatchSet } from './match-set.entity';
import { League } from 'src/leagues/league.entity';
import { User } from 'src/users/user.entity';
import { LeaguesService } from 'src/leagues/leagues.service';
@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchSet, League, User])],
  providers: [MatchesService, LeaguesService],
  controllers: [MatchesController],
})
export class MatchesModule {}
