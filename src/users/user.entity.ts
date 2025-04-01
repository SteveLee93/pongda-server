import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

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
}
