import { User } from 'src/users/user.entity';
import { Match } from 'src/matches/match.entity';
export declare class Memo {
    id: number;
    user: User;
    match: Match;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
