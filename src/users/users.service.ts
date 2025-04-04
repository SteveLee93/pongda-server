import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { Match } from 'src/matches/match.entity';
import { Memo } from 'src/memos/memo.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
    @InjectRepository(Memo)
    private readonly memoRepo: Repository<Memo>,
  ) { }

  async create(userData: CreateUserDto): Promise<User> {
    // 이메일 중복 체크
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    const user = this.usersRepository.create();
    user.email = userData.email;
    user.nickname = userData.nickname;
    
    // 비밀번호 해시 처리
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(userData.password, salt);
    user.role = userData.role ?? 'player';

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      // 혹시 모를 다른 중복 에러 처리
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('이미 사용 중인 이메일입니다.');
      }
      throw error;
    }
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

  async getMyPage(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: [
        'parentLeaguesCreated',
        'seasonLeaguesCreated',
        'leagueParticipants',
        'leagueParticipants.seasonLeague',
        'memos',
        'memos.match',
        'memos.match.player1',
        'memos.match.player2'
      ],
    });

    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const joinedLeagues = user.leagueParticipants.map(lp => lp.seasonLeague);
    const formattedMemos = user.memos.map(memo => ({
      id: memo.id,
      match: memo.match.id,
      content: memo.content,
      createdAt: memo.createdAt,
      updatedAt: memo.updatedAt
    }));

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
      createdAt: user.createdAt,
      leaguesCreated: {
        parentLeagues: user.parentLeaguesCreated || [],
        seasonLeagues: user.seasonLeaguesCreated || []
      },
      leaguesJoined: joinedLeagues,
      memos: formattedMemos
    };
  }

  async getMyStats(userId: number) {
    const matches = await this.matchRepo.find({
      where: [
        { player1: { id: userId } },
        { player2: { id: userId } }
      ],
      relations: {
        player1: true,
        player2: true,
        winner: true,
        sets: true,
        seasonLeague: true
      },
      select: {
        id: true,
        scorePlayer1: true,
        scorePlayer2: true,
        scheduledDateTime: true,
        player1: {
          id: true,
          nickname: true
        },
        player2: {
          id: true,
          nickname: true
        },
        winner: {
          id: true
        },
        seasonLeague: {
          id: true,
          name: true
        },
        sets: {
          id: true,
          scorePlayer1: true,
          scorePlayer2: true
        }
      }
    });

    // 디버깅을 위한 로그
    // console.log('User ID:', userId);
    // console.log('Raw matches:', matches);
  
    const memos = await this.memoRepo.find({
      where: { user: { id: userId } }
    });
  
    const totalMatches = matches.length;
    const wins = matches.filter(match => match.winner?.id === userId).length;
    const losses = totalMatches - wins;
    const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;
  
    let totalSetPoints = 0;
    let totalSetCount = 0;
  
    for (const match of matches) {
      for (const set of match.sets) {
        const myPoint = match.player1.id === userId ? set.scorePlayer1 : set.scorePlayer2;
        totalSetPoints += myPoint;
        totalSetCount += 1;
      }
    }
  
    const avgSetScore = totalSetCount > 0 ? totalSetPoints / totalSetCount : 0;
  
    return {
      totalMatches,
      wins,
      losses,
      winRate: Math.round(winRate * 10) / 10,
      avgSetScore: Math.round(avgSetScore * 10) / 10,
      totalMemos: memos.length,
    };
  }
  
}
