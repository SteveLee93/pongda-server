import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { League } from 'src/leagues/league.entity';
  import { User } from 'src/users/user.entity';
  import { MatchSet } from './match-set.entity';
  import { ApiProperty } from '@nestjs/swagger';

  @Entity()
  export class Match {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: '매치 ID', example: 1 })
    id: number;
  
    @ManyToOne(() => League)
    @ApiProperty({ description: '리그 ID', example: 1 })
    league: League;
  
    @ManyToOne(() => User)
    @ApiProperty({ description: '선수1 ID', example: 1 })
    player1: User;
  
    @ManyToOne(() => User)
    @ApiProperty({ description: '선수2 ID', example: 2 })
    player2: User;
  
    @Column()
    @ApiProperty({ description: '선수1 점수', example: 11 })
    scorePlayer1: number;
  
    @Column()
    @ApiProperty({ description: '선수2 점수', example: 11 })
    scorePlayer2: number;
  
    @ManyToOne(() => User)
    @ApiProperty({ description: '승자 ID', example: 1 })
    winner: User;
  
    @CreateDateColumn()
    @ApiProperty({ description: '매치 일자', example: '2025-01-01' })
    matchDate: Date;

    @OneToMany(() => MatchSet, set => set.match, { cascade: true })
    @ApiProperty({ description: '세트 정보', type: [MatchSet] })
    sets: MatchSet[];
  }
  