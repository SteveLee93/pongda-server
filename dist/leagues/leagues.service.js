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
exports.LeaguesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const league_entity_1 = require("./league.entity");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const league_participant_entity_1 = require("../league-participants/league-participant.entity");
let LeaguesService = class LeaguesService {
    leagueRepo;
    usersService;
    leagueParticipantRepo;
    constructor(leagueRepo, usersService, leagueParticipantRepo) {
        this.leagueRepo = leagueRepo;
        this.usersService = usersService;
        this.leagueParticipantRepo = leagueParticipantRepo;
    }
    async create(dto, userFromJwt) {
        if (userFromJwt.role !== 'manager') {
            throw new common_1.ForbiddenException('관장만 리그를 생성할 수 있습니다.');
        }
        const user = await this.usersService.findOne(userFromJwt.userId);
        if (!user) {
            throw new common_1.ForbiddenException('사용자를 찾을 수 없습니다.');
        }
        const league = this.leagueRepo.create({
            name: dto.name,
            description: dto.description || '',
            startDate: new Date(dto.startDate),
            endDate: new Date(dto.endDate),
            createdBy: user
        });
        return this.leagueRepo.save(league);
    }
    async findAll() {
        const options = {
            relations: ['createdBy'],
            order: { createdAt: 'DESC' },
        };
        return this.leagueRepo.find(options);
    }
    async joinLeague(leagueId, user) {
        const league = await this.leagueRepo.findOne({
            where: { id: leagueId }
        });
        if (!league) {
            throw new common_1.NotFoundException('리그를 찾을 수 없습니다.');
        }
        console.log('Checking participation for:', { userId: user.id, leagueId });
        const existing = await this.leagueParticipantRepo.findOne({
            where: {
                league: { id: leagueId },
                user: { id: user.id }
            }
        });
        console.log('Existing participant:', existing);
        if (existing) {
            throw new common_1.ConflictException('이미 참가한 리그입니다.');
        }
        const participant = this.leagueParticipantRepo.create();
        participant.league = league;
        const userEntity = await this.usersService.findOne(user.id);
        if (!userEntity) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        participant.user = userEntity;
        const savedParticipant = await this.leagueParticipantRepo.save(participant);
        const result = await this.leagueParticipantRepo.findOne({
            where: { id: savedParticipant.id },
            relations: {
                user: true,
                league: true
            }
        });
        if (!result) {
            throw new common_1.NotFoundException('참가자 정보를 찾을 수 없습니다.');
        }
        return result;
    }
    async getParticipants(leagueId) {
        const league = await this.leagueRepo.findOne({ where: { id: leagueId } });
        if (!league) {
            throw new common_1.NotFoundException('리그를 찾을 수 없습니다.');
        }
        const participants = await this.leagueParticipantRepo.find({
            where: { league: { id: leagueId } },
            relations: ['user'],
        });
        return participants.map(p => p.user);
    }
};
exports.LeaguesService = LeaguesService;
exports.LeaguesService = LeaguesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(league_entity_1.League)),
    __param(2, (0, typeorm_1.InjectRepository)(league_participant_entity_1.LeagueParticipant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        typeorm_2.Repository])
], LeaguesService);
//# sourceMappingURL=leagues.service.js.map