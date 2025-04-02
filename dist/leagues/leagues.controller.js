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
exports.LeaguesController = void 0;
const common_1 = require("@nestjs/common");
const create_league_dto_1 = require("./dto/create-league.dto");
const leagues_service_1 = require("./leagues.service");
const passport_1 = require("@nestjs/passport");
const users_service_1 = require("../users/users.service");
let LeaguesController = class LeaguesController {
    leaguesService;
    usersService;
    constructor(leaguesService, usersService) {
        this.leaguesService = leaguesService;
        this.usersService = usersService;
    }
    async create(dto, req) {
        console.log('User object:', req.user);
        try {
            return await this.leaguesService.create(dto, req.user);
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAll() {
        return this.leaguesService.findAll();
    }
    async join(id, req) {
        const user = await this.usersService.findOne(req.user.userId);
        if (!user) {
            throw new common_1.BadRequestException('사용자를 찾을 수 없습니다.');
        }
        return this.leaguesService.joinLeague(id, user);
    }
    async getParticipants(id) {
        return this.leaguesService.getParticipants(id);
    }
};
exports.LeaguesController = LeaguesController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_league_dto_1.CreateLeagueDto, Object]),
    __metadata("design:returntype", Promise)
], LeaguesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaguesController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(':id/join'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LeaguesController.prototype, "join", null);
__decorate([
    (0, common_1.Get)(':id/users'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LeaguesController.prototype, "getParticipants", null);
exports.LeaguesController = LeaguesController = __decorate([
    (0, common_1.Controller)('leagues'),
    __metadata("design:paramtypes", [leagues_service_1.LeaguesService,
        users_service_1.UsersService])
], LeaguesController);
//# sourceMappingURL=leagues.controller.js.map