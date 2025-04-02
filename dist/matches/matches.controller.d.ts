import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { Match } from './match.entity';
export declare class MatchesController {
    private readonly matchesService;
    constructor(matchesService: MatchesService);
    createMatch(dto: CreateMatchDto): Promise<Match>;
    getAllMatches(): Promise<Match[]>;
    getMatchById(id: number): Promise<Match>;
    getMatchesByUser(id: number): Promise<Match[]>;
}
