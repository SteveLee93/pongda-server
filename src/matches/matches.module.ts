import { Module, forwardRef } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { MatchSet } from './match-set.entity';
import { League } from 'src/leagues/league.entity';
import { User } from 'src/users/user.entity';
import { LeaguesModule } from 'src/leagues/leagues.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, MatchSet, League, User]),
    forwardRef(() => LeaguesModule)
  ],
  providers: [MatchesService],
  controllers: [MatchesController],
  exports: [MatchesService]
})
export class MatchesModule {}
