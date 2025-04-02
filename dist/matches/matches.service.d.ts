import { Match } from './match.entity';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { League } from 'src/leagues/league.entity';
import { User } from 'src/users/user.entity';
import { LeaguesService } from 'src/leagues/leagues.service';
export declare class MatchesService {
    private matchRepo;
    private leagueRepo;
    private userRepo;
    private leagueService;
    constructor(matchRepo: Repository<Match>, leagueRepo: Repository<League>, userRepo: Repository<User>, leagueService: LeaguesService);
    create(dto: CreateMatchDto): Promise<Match>;
    findAll(): Promise<Match[]>;
    findByUser(userId: number): Promise<Match[]>;
    findOneById(id: number): Promise<Match>;
}
