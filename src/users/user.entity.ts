import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { League } from 'src/leagues/league.entity';
import { LeagueParticipant } from 'src/league-participants/league-participant.entity';
import { Memo } from 'src/memos/memo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 30 })
  nickname: string;

  @Column({ length: 100 })
  passwordHash: string;

  @Column({ default: 'player' }) // 'player' | 'manager'
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => League, league => league.createdBy)
  leaguesCreated: League[];

  @OneToMany(() => LeagueParticipant, lp => lp.user)
  leagueParticipants: LeagueParticipant[];

  @OneToMany(() => Memo, memo => memo.user)
  memos: Memo[];
}
