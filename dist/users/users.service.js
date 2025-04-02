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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const match_entity_1 = require("../matches/match.entity");
const memo_entity_1 = require("../memos/memo.entity");
let UsersService = class UsersService {
    usersRepository;
    matchRepo;
    memoRepo;
    constructor(usersRepository, matchRepo, memoRepo) {
        this.usersRepository = usersRepository;
        this.matchRepo = matchRepo;
        this.memoRepo = memoRepo;
    }
    async create(userData) {
        const user = this.usersRepository.create();
        user.email = userData.email ?? '';
        user.nickname = userData.nickname ?? '';
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(userData.password, salt);
        user.role = userData.role ?? 'player';
        return this.usersRepository.save(user);
    }
    async findAll() {
        return this.usersRepository.find();
    }
    async findOne(id) {
        return this.usersRepository.findOneBy({ id });
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async getMyPage(userId) {
        const memos = await this.memoRepo.find({
            where: { user: { id: userId } },
            relations: ['match'],
        });
        console.log('Found memos:', memos);
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: [
                'leaguesCreated',
                'leagueParticipants',
                'leagueParticipants.league',
                'memos',
                'memos.match',
                'memos.match.player1',
                'memos.match.player2'
            ],
        });
        if (!user)
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        const joinedLeagues = user.leagueParticipants.map(lp => lp.league);
        const formattedMemos = user.memos.map(memo => ({
            id: memo.id,
            match: memo.match.id,
            content: memo.content,
            createdAt: memo.createdAt,
            updatedAt: memo.updatedAt
        }));
        return {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            role: user.role,
            createdAt: user.createdAt,
            leaguesCreated: user.leaguesCreated,
            leaguesJoined: joinedLeagues,
            memos: formattedMemos
        };
    }
    async getMyStats(userId) {
        const matches = await this.matchRepo.find({
            where: [
                { player1: { id: userId } },
                { player2: { id: userId } }
            ],
            relations: {
                player1: true,
                player2: true,
                winner: true,
                sets: true,
                league: true
            },
            select: {
                id: true,
                scorePlayer1: true,
                scorePlayer2: true,
                matchDate: true,
                player1: {
                    id: true,
                    nickname: true
                },
                player2: {
                    id: true,
                    nickname: true
                },
                winner: {
                    id: true
                },
                league: {
                    id: true,
                    name: true
                },
                sets: {
                    id: true,
                    scorePlayer1: true,
                    scorePlayer2: true
                }
            }
        });
        const memos = await this.memoRepo.find({
            where: { user: { id: userId } }
        });
        const totalMatches = matches.length;
        const wins = matches.filter(match => match.winner?.id === userId).length;
        const losses = totalMatches - wins;
        const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;
        let totalSetPoints = 0;
        let totalSetCount = 0;
        for (const match of matches) {
            for (const set of match.sets) {
                const myPoint = match.player1.id === userId ? set.scorePlayer1 : set.scorePlayer2;
                totalSetPoints += myPoint;
                totalSetCount += 1;
            }
        }
        const avgSetScore = totalSetCount > 0 ? totalSetPoints / totalSetCount : 0;
        return {
            totalMatches,
            wins,
            losses,
            winRate: Math.round(winRate * 10) / 10,
            avgSetScore: Math.round(avgSetScore * 10) / 10,
            totalMemos: memos.length,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __param(2, (0, typeorm_1.InjectRepository)(memo_entity_1.Memo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map