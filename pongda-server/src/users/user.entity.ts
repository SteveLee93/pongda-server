import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { LeagueParticipant } from 'src/league-participants/league-participant.entity';
import { Memo } from 'src/memos/memo.entity';
import { ParentLeague } from 'src/leagues/entities/parent-league.entity';
import { SeasonLeague } from 'src/leagues/entities/season-league.entity';

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

  @OneToMany(() => ParentLeague, parentLeague => parentLeague.createdBy)
  parentLeaguesCreated: ParentLeague[];

  @OneToMany(() => SeasonLeague, seasonLeague => seasonLeague.createdBy)
  seasonLeaguesCreated: SeasonLeague[];

  @OneToMany(() => LeagueParticipant, participant => participant.user)
  leagueParticipants: LeagueParticipant[];

  @OneToMany(() => Memo, memo => memo.user)
  memos: Memo[];
}
