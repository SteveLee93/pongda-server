import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
  } from 'typeorm';
  import { User } from 'src/users/user.entity';
  import { Match } from 'src/matches/match.entity';
  
  @Entity()
  @Unique(['user', 'match']) // 한 유저는 한 경기당 하나의 메모만
  export class Memo {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, user => user.memos)
    user: User;
  
    @ManyToOne(() => Match)
    match: Match;
  
    @Column({ type: 'text' })
    content: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  