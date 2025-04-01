import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { LeagueParticipant } from 'src/league-participants/league-participant.entity';

@Entity()
export class League {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @ManyToOne(() => User, user => user.leaguesCreated, {
    nullable: false,
    onDelete: 'CASCADE'  // 사용자가 삭제되면 리그도 삭제
  })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => LeagueParticipant, lp => lp.league)
  participants: LeagueParticipant[];
}