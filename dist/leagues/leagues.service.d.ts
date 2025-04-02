import { League } from './league.entity';
import { Repository } from 'typeorm';
import { CreateLeagueDto } from './dto/create-league.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LeagueParticipant } from 'src/league-participants/league-participant.entity';
export declare class LeaguesService {
    private readonly leagueRepo;
    private readonly usersService;
    private readonly leagueParticipantRepo;
    constructor(leagueRepo: Repository<League>, usersService: UsersService, leagueParticipantRepo: Repository<LeagueParticipant>);
    create(dto: CreateLeagueDto, userFromJwt: any): Promise<League>;
    findAll(): Promise<League[]>;
    joinLeague(leagueId: number, user: User): Promise<LeagueParticipant>;
    getParticipants(leagueId: number): Promise<User[]>;
}
