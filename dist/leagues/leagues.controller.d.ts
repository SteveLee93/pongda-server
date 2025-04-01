import { CreateLeagueDto } from './dto/create-league.dto';
import { LeaguesService } from './leagues.service';
export declare class LeaguesController {
    private readonly leaguesService;
    constructor(leaguesService: LeaguesService);
    create(dto: CreateLeagueDto, req: any): Promise<import("./league.entity").League>;
}
