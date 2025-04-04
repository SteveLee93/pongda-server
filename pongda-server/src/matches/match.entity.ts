import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { User } from 'src/users/user.entity';
  import { MatchSet } from './match-set.entity';
  import { ApiProperty } from '@nestjs/swagger';
  import { TournamentFormat } from 'src/leagues/enums/league.enum';
  import { SeasonLeague } from 'src/leagues/entities/season-league.entity';

  @Entity()
  export class Match {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: '매치 ID', example: 1 })
    id: number;
  
    @ManyToOne(() => SeasonLeague)
    @ApiProperty({ description: '시즌 리그' })
    seasonLeague: SeasonLeague;
  
    @Column({ type: 'enum', enum: TournamentFormat })
    @ApiProperty({ description: '경기 단계 (예선/본선)', enum: TournamentFormat })
    stage: TournamentFormat;
  
    @Column({ nullable: true })
    @ApiProperty({ description: '예선 그룹 번호' })
    qualifierGroupNumber?: number;
  
    @Column({ nullable: true })
    @ApiProperty({ description: '본선 라운드 (8강, 4강 등)' })
    playoffRound?: number;
  
    @ManyToOne(() => User)
    @ApiProperty({ description: '선수1 ID', example: 1 })
    player1: User;
  
    @ManyToOne(() => User)
    @ApiProperty({ description: '선수2 ID', example: 2 })
    player2: User;
  
    @Column({ default: 0 })
    @ApiProperty({ description: '선수1 점수', example: 11 })
    scorePlayer1: number;
  
    @Column({ default: 0 })
    @ApiProperty({ description: '선수2 점수', example: 11 })
    scorePlayer2: number;
  
    @ManyToOne(() => User, { nullable: true })
    @ApiProperty({ description: '승자 ID', example: 1 })
    winner: User;
  
    @Column({ type: 'datetime' })
    @ApiProperty({ description: '경기 일시' })
    scheduledDateTime: Date;
  
    @CreateDateColumn()
    @ApiProperty({ description: '매치 일자', example: '2025-01-01' })
    createdAt: Date;

    @OneToMany(() => MatchSet, set => set.match, { cascade: true })
    @ApiProperty({ type: () => [MatchSet] })
    sets: MatchSet[];
  }
  