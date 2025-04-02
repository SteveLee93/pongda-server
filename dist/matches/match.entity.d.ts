import { League } from 'src/leagues/league.entity';
import { User } from 'src/users/user.entity';
import { MatchSet } from './match-set.entity';
export declare class Match {
    id: number;
    league: League;
    player1: User;
    player2: User;
    scorePlayer1: number;
    scorePlayer2: number;
    winner: User;
    matchDate: Date;
    sets: MatchSet[];
}
