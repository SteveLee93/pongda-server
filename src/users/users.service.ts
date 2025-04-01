import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async create(userData: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create();
    user.email = userData.email ?? '';
    user.nickname = userData.nickname ?? '';
    // 비밀번호 해시 처리
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(userData.password, salt);
    user.role = userData.role ?? 'player';

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
