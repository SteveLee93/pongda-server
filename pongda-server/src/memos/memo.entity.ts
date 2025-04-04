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
  import { ApiProperty } from '@nestjs/swagger';

  @Entity()
  @Unique(['user', 'match']) // 한 유저는 한 경기당 하나의 메모만
  export class Memo {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: '메모 ID', example: 1 })
    id: number;

    @ManyToOne(() => User, user => user.memos)
    @ApiProperty({ description: '유저 ID', example: 1 })
    user: User;

    @ManyToOne(() => Match)
    @ApiProperty({ description: '매치 ID', example: 1 })
    match: Match;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn()
    @ApiProperty({ description: '메모 생성일', example: '2025-01-01' })
    createdAt: Date;

    @UpdateDateColumn()
    @ApiProperty({ description: '메모 수정일', example: '2025-01-01' })
    updatedAt: Date;
  }
  