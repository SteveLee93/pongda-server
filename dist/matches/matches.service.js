"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const match_entity_1 = require("./match.entity");
const typeorm_2 = require("typeorm");
const league_entity_1 = require("../leagues/league.entity");
const user_entity_1 = require("../users/user.entity");
let MatchesService = class MatchesService {
    matchRepo;
    leagueRepo;
    userRepo;
    constructor(matchRepo, leagueRepo, userRepo) {
        this.matchRepo = matchRepo;
        this.leagueRepo = leagueRepo;
        this.userRepo = userRepo;
    }
    async create(dto) {
        const league = await this.leagueRepo.findOneBy({ id: dto.leagueId });
        const player1 = await this.userRepo.findOneBy({ id: dto.player1Id });
        const player2 = await this.userRepo.findOneBy({ id: dto.player2Id });
        if (!league || !player1 || !player2)
            throw new common_1.NotFoundException('리그나 유저가 없습니다.');
        let winsP1 = 0;
        let winsP2 = 0;
        const sets = dto.sets.map(set => {
            if (set.scorePlayer1 > set.scorePlayer2)
                winsP1++;
            else if (set.scorePlayer2 > set.scorePlayer1)
                winsP2++;
            return {
                ...set,
            };
        });
        const winner = winsP1 > winsP2 ? player1 : player2;
        const match = this.matchRepo.create({
            league,
            player1,
            player2,
            scorePlayer1: winsP1,
            scorePlayer2: winsP2,
            winner,
            sets,
        });
        return this.matchRepo.save(match);
    }
    async findAll() {
        return this.matchRepo.find({
            relations: ['league', 'player1', 'player2', 'winner', 'sets'],
            order: { matchDate: 'DESC' },
        });
    }
    async findByUser(userId) {
        return this.matchRepo.find({
            where: [
                { player1: { id: userId } },
                { player2: { id: userId } },
            ],
            relations: ['league', 'player1', 'player2', 'winner', 'sets'],
            order: { matchDate: 'DESC' },
        });
    }
    async findOneById(id) {
        const match = await this.matchRepo.findOne({
            where: { id },
            relations: ['league', 'player1', 'player2', 'winner', 'sets'],
        });
        if (!match)
            throw new common_1.NotFoundException('경기를 찾을 수 없습니다.');
        return match;
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __param(1, (0, typeorm_1.InjectRepository)(league_entity_1.League)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MatchesService);
//# sourceMappingURL=matches.service.js.map