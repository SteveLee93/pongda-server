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
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class League {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '리그 ID', example: 1 })
  id: number;

  @Column()
  @ApiProperty({ description: '리그 이름', example: '리그 이름' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '리그 설명', example: '리그 설명' })
  description: string;

  @Column({ type: 'date' })
  @ApiProperty({ description: '리그 시작일', example: '2025-01-01' })
  startDate: Date;

  @Column({ type: 'date' })
  @ApiProperty({ description: '리그 종료일', example: '2025-01-01' })
  endDate: Date;

  @ManyToOne(() => User, user => user.leaguesCreated, {
    nullable: false,
    onDelete: 'CASCADE'  // 사용자가 삭제되면 리그도 삭제
  })
  @ApiProperty({ description: '리그 생성자', example: '리그 생성자' })
  createdBy: User;

  @CreateDateColumn()
  @ApiProperty({ description: '리그 생성일', example: '2025-01-01' })
  createdAt: Date;

  @OneToMany(() => LeagueParticipant, lp => lp.league)
  @ApiProperty({ description: '리그 참여자', example: '리그 참여자' })
  participants: LeagueParticipant[];
}