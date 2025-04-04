import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LeaguesModule } from './leagues/leagues.module';
import { MatchesModule } from './matches/matches.module';
import { MemosModule } from './memos/memos.module';
import { User } from './users/user.entity';
import { Match } from './matches/match.entity';
import { ParentLeague } from './leagues/entities/parent-league.entity';
import { SeasonLeague } from './leagues/entities/season-league.entity';
import { LeagueParticipant } from './league-participants/league-participant.entity';
import { Memo } from './memos/memo.entity';
import { MatchSet } from './matches/match-set.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true, // 개발 단계에서만 true
      synchronize: true,
      entities: [
        User,
        Match,
        MatchSet,
        ParentLeague,
        SeasonLeague,
        LeagueParticipant,
        Memo
      ],
    }),
    UsersModule,
    AuthModule,
    LeaguesModule,
    MatchesModule,
    MemosModule,
  ],
})
export class AppModule { }
