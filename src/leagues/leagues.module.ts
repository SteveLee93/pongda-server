import { Module, forwardRef } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { LeaguesController } from './leagues.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { League } from './league.entity';
import { LeagueParticipant } from 'src/league-participants/league-participant.entity';
import { UsersModule } from 'src/users/users.module';
import { MatchesModule } from 'src/matches/matches.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([League, LeagueParticipant]),
    UsersModule,
    forwardRef(() => MatchesModule)
  ],
  controllers: [LeaguesController],
  providers: [LeaguesService],
  exports: [LeaguesService]
})
export class LeaguesModule { }
