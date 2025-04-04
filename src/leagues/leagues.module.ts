import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeagueParticipant } from 'src/league-participants/league-participant.entity';
import { UsersModule } from 'src/users/users.module';
import { MatchesModule } from 'src/matches/matches.module';
import { ParentLeaguesController } from 'src/leagues/controllers/parent-leagues.controller';
import { SeasonLeaguesController } from 'src/leagues/controllers/season-leagues.controller';
import { ParentLeaguesService } from 'src/leagues/services/parent-leagues.service';
import { SeasonLeaguesService } from 'src/leagues/services/season-leagues.service';
import { ParentLeague } from 'src/leagues/entities/parent-league.entity';
import { SeasonLeague } from 'src/leagues/entities/season-league.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParentLeague, SeasonLeague, LeagueParticipant]),
    UsersModule,
    forwardRef(() => MatchesModule)
  ],
  controllers: [ParentLeaguesController, SeasonLeaguesController],
  providers: [ParentLeaguesService, SeasonLeaguesService],
  exports: [ParentLeaguesService, SeasonLeaguesService]
})
export class LeaguesModule { }
