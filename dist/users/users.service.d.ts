import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Match } from 'src/matches/match.entity';
import { Memo } from 'src/memos/memo.entity';
export declare class UsersService {
    private readonly usersRepository;
    private readonly matchRepo;
    private readonly memoRepo;
    constructor(usersRepository: Repository<User>, matchRepo: Repository<Match>, memoRepo: Repository<Memo>);
    create(userData: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    getMyPage(userId: number): Promise<{
        id: number;
        email: string;
        nickname: string;
        role: string;
        createdAt: Date;
        leaguesCreated: import("../leagues/league.entity").League[];
        leaguesJoined: import("../leagues/league.entity").League[];
        memos: {
            id: number;
            match: number;
            content: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    getMyStats(userId: number): Promise<{
        totalMatches: number;
        wins: number;
        losses: number;
        winRate: number;
        avgSetScore: number;
        totalMemos: number;
    }>;
}
