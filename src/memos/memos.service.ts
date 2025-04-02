import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memo } from './memo.entity';
import { User } from 'src/users/user.entity';
import { Match } from 'src/matches/match.entity';

@Injectable()
export class MemosService {
  constructor(
    @InjectRepository(Memo)
    private memoRepo: Repository<Memo>,
    @InjectRepository(Match)
    private matchRepo: Repository<Match>,
  ) {}

  async saveMemo(user: User, matchId: number, content: string): Promise<Memo> {
    const match = await this.matchRepo.findOneBy({ id: matchId });
    if (!match) throw new NotFoundException('경기를 찾을 수 없습니다.');
  
    let memo = await this.memoRepo.findOne({
      where: { user: { id: user.id }, match: { id: matchId } },
    });
  
    if (memo) {
      memo.content = content;
    } else {
      memo = this.memoRepo.create({ user, match, content });
    }
  
    return this.memoRepo.save(memo);
  }
  
  async getMyMemo(user: User, matchId: number): Promise<Memo | null> {
    return this.memoRepo.findOne({
      where: {
        user: { id: user.id },
        match: { id: matchId },
      },
    });
  }
}
