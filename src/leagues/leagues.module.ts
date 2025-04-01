import { Module } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { LeaguesController } from './leagues.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { League } from './league.entity';
import { LeagueParticipant } from 'src/league-participants/league-participant.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([League, LeagueParticipant]),
    UsersModule,
  ],
  controllers: [LeaguesController],
  providers: [LeaguesService],
})
export class LeaguesModule { }
