import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { User } from 'src/users/user.entity';
import { SeasonLeague } from 'src/leagues/entities/season-league.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class LeagueParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.leagueParticipants)
  user: User;

  @ManyToOne(() => SeasonLeague, seasonLeague => seasonLeague.participants)
  seasonLeague: SeasonLeague;

  @Column({ nullable: true })
  @ApiProperty({ description: '예선 그룹 번호' })
  qualifierGroupNumber: number;

  @CreateDateColumn()
  joinedAt: Date;
}
