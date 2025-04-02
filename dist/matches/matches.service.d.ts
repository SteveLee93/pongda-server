import { Match } from './match.entity';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { League } from 'src/leagues/league.entity';
import { User } from 'src/users/user.entity';
export declare class MatchesService {
    private matchRepo;
    private leagueRepo;
    private userRepo;
    constructor(matchRepo: Repository<Match>, leagueRepo: Repository<League>, userRepo: Repository<User>);
    create(dto: CreateMatchDto): Promise<Match>;
    findAll(): Promise<Match[]>;
    findByUser(userId: number): Promise<Match[]>;
    findOneById(id: number): Promise<Match>;
}
