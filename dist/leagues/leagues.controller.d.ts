import { CreateLeagueDto } from './dto/create-league.dto';
import { LeaguesService } from './leagues.service';
import { UsersService } from '../users/users.service';
export declare class LeaguesController {
    private readonly leaguesService;
    private readonly usersService;
    constructor(leaguesService: LeaguesService, usersService: UsersService);
    create(dto: CreateLeagueDto, req: any): Promise<import("./league.entity").League>;
    getAll(): Promise<import("./league.entity").League[]>;
    join(id: number, req: any): Promise<import("../league-participants/league-participant.entity").LeagueParticipant>;
    getParticipants(id: number): Promise<import("../users/user.entity").User[]>;
}
