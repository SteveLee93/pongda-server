import { League } from './league.entity';
import { Repository } from 'typeorm';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UsersService } from 'src/users/users.service';
export declare class LeaguesService {
    private readonly leagueRepo;
    private readonly usersService;
    constructor(leagueRepo: Repository<League>, usersService: UsersService);
    create(dto: CreateLeagueDto, userFromJwt: any): Promise<League>;
}
