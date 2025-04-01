import { User } from 'src/users/user.entity';
import { LeagueParticipant } from 'src/league-participants/league-participant.entity';
export declare class League {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    createdBy: User;
    createdAt: Date;
    participants: LeagueParticipant[];
}
