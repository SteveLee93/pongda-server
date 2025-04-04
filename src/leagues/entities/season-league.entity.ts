import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ParentLeague } from 'src/leagues/entities/parent-league.entity';
import { Match } from 'src/matches/match.entity';
import { LeagueParticipant } from 'src/league-participants/league-participant.entity';
import { GameType, MatchFormat, TournamentFormat, LeagueStatus } from 'src/leagues/enums/league.enum';

@Entity()
export class SeasonLeague {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '시즌 리그 ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '리그 이름' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '리그 설명' })
  description: string;

  @Column()
  @ApiProperty({ description: '시즌 정보' })
  seasonInfo: string;

  @Column({ type: 'enum', enum: MatchFormat, default: MatchFormat.BEST_OF_5 })
  @ApiProperty({ description: '승리 조건', enum: MatchFormat })
  matchFormat: MatchFormat;

  @Column({ type: 'enum', enum: GameType, default: GameType.SINGLES })
  @ApiProperty({ description: '경기 방식', enum: GameType })
  gameType: GameType;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: '시작 날짜 및 시간' })
  startDateTime: Date;

  @Column({ type: 'enum', enum: TournamentFormat, default: TournamentFormat.LEAGUE })
  @ApiProperty({ description: '예선 방식', enum: TournamentFormat })
  qualifierFormat: TournamentFormat;

  @Column({ type: 'enum', enum: TournamentFormat, default: TournamentFormat.TOURNAMENT })
  @ApiProperty({ description: '본선 방식', enum: TournamentFormat })
  playoffFormat: TournamentFormat;

  @Column({ type: 'enum', enum: LeagueStatus, default: LeagueStatus.ACCEPTING })
  @ApiProperty({ description: '리그 상태', enum: LeagueStatus })
  status: LeagueStatus;

  @ManyToOne(() => ParentLeague, parentLeague => parentLeague.seasonLeagues)
  @ApiProperty({ description: '상위 리그' })
  parentLeague: ParentLeague;

  @ManyToOne(() => User)
  @ApiProperty({ description: '생성자' })
  createdBy: User;

  @CreateDateColumn()
  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  @OneToMany(() => LeagueParticipant, participant => participant.seasonLeague)
  participants: LeagueParticipant[];

  @OneToMany(() => Match, match => match.seasonLeague)
  matches: Match[];
}
