import { Repository } from 'typeorm';
import { Memo } from './memo.entity';
import { User } from 'src/users/user.entity';
import { Match } from 'src/matches/match.entity';
export declare class MemosService {
    private memoRepo;
    private matchRepo;
    constructor(memoRepo: Repository<Memo>, matchRepo: Repository<Match>);
    saveMemo(user: User, matchId: number, content: string): Promise<Memo>;
    getMyMemo(user: User, matchId: number): Promise<Memo | null>;
}
