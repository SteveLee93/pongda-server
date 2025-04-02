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

  @Entity()
  export class Match {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => League)
    league: League;
  
    @ManyToOne(() => User)
    player1: User;
  
    @ManyToOne(() => User)
    player2: User;
  
    @Column()
    scorePlayer1: number;
  
    @Column()
    scorePlayer2: number;
  
    @ManyToOne(() => User)
    winner: User;
  
    @CreateDateColumn()
    matchDate: Date;

    @OneToMany(() => MatchSet, set => set.match, { cascade: true })
    sets: MatchSet[];
  }
  