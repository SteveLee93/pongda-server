import { User } from 'src/users/user.entity';
import { League } from 'src/leagues/league.entity';
export declare class LeagueParticipant {
    id: number;
    user: User;
    league: League;
    joinedAt: Date;
}
