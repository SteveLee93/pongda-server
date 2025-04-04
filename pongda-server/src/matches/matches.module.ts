import { Module, forwardRef } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { MatchSet } from 'src/matches/match-set.entity';
import { User } from 'src/users/user.entity';
import { LeaguesModule } from 'src/leagues/leagues.module';
import { SeasonLeague } from 'src/leagues/entities/season-league.entity';  

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, SeasonLeague, User, MatchSet]),
    forwardRef(() => LeaguesModule)
  ],
  providers: [MatchesService],
  controllers: [MatchesController],
  exports: [MatchesService]
})
export class MatchesModule {}
