import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Match } from 'src/matches/match.entity';

@Entity()
export class MatchSet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Match, match => match.sets, { onDelete: 'CASCADE' })
  match: Match;

  @Column()
  setNumber: number;

  @Column()
  scorePlayer1: number;

  @Column()
  scorePlayer2: number;
}
