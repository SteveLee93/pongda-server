import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { League } from 'src/leagues/league.entity';

@Entity()
export class LeagueParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.leagueParticipants)
  user: User;

  @ManyToOne(() => League, league => league.participants)
  league: League;

  @CreateDateColumn()
  joinedAt: Date;
}
