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

  async saveMemo(userId: number, matchId: number, content: string): Promise<Memo> {
    const match = await this.matchRepo.findOneBy({ id: matchId });
    if (!match) throw new NotFoundException('경기를 찾을 수 없습니다.');
  
    // User 엔티티 참조 객체 생성
    const userRef = { id: userId } as User;
  
    let memo = await this.memoRepo.findOne({
      where: { user: { id: userId }, match: { id: matchId } },
    });
  
    if (memo) {
      memo.content = content;
    } else {
      memo = this.memoRepo.create({ 
        user: userRef,  // User 참조 객체 사용
        match, 
        content 
      });
    }
  
    return this.memoRepo.save(memo);
  }
  
  async getMyMemo(userId: number, matchId: number): Promise<Memo | null> {
    const memo = await this.memoRepo.findOne({
      where: {
        user: { id: userId },
        match: { id: matchId }
      },
      relations: ['match'],  // match 정보도 함께 로드
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        match: {
          id: true
        }
      }
    });

    if (!memo) {
      return null;  // 메모가 없는 경우 null 반환
    }

    return memo;
  }
}
