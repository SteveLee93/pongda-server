import { League } from 'src/leagues/league.entity';
import { LeagueParticipant } from 'src/league-participants/league-participant.entity';
export declare class User {
    id: number;
    email: string;
    nickname: string;
    passwordHash: string;
    role: string;
    createdAt: Date;
    leaguesCreated: League[];
    leagueParticipants: LeagueParticipant[];
}
