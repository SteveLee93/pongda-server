import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SeasonLeague } from 'src/leagues/entities/season-league.entity';

@Entity()
export class ParentLeague {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '상위 리그 ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '리그 이름' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '리그 설명' })
  description: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '시/도', example: '인천시' })
  city: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '구/군', example: '부평구' })
  district: string;

  @ManyToOne(() => User)
  @ApiProperty({ description: '생성자' })
  createdBy: User;

  @CreateDateColumn()
  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  @OneToMany(() => SeasonLeague, seasonLeague => seasonLeague.parentLeague)
  seasonLeagues: SeasonLeague[];
}
