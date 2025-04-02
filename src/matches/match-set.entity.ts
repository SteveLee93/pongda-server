import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Match } from 'src/matches/match.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class MatchSet {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '세트 ID', example: 1 })
  id: number;

  @ManyToOne(() => Match, match => match.sets, { onDelete: 'CASCADE' })
  @ApiProperty({ description: '매치 ID', example: 1 })
  match: Match;

  @Column()
  @ApiProperty({ description: '세트 번호', example: 1 })
  setNumber: number;

  @Column()
  @ApiProperty({ description: '선수1 점수', example: 11 })
  scorePlayer1: number;

  @Column()
  @ApiProperty({ description: '선수2 점수', example: 11 })
  scorePlayer2: number;
}
