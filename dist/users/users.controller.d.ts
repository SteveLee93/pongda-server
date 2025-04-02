import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
interface RequestWithUser extends Request {
    user: {
        userId: number;
    };
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getMyStats(req: RequestWithUser): Promise<{
        totalMatches: number;
        wins: number;
        losses: number;
        winRate: number;
        avgSetScore: number;
        totalMemos: number;
    }>;
    getMe(req: RequestWithUser): Promise<{
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
    getUserById(id: number): Promise<User | null>;
}
export {};
