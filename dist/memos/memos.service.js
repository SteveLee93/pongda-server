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
exports.MemosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const memo_entity_1 = require("./memo.entity");
const match_entity_1 = require("../matches/match.entity");
let MemosService = class MemosService {
    memoRepo;
    matchRepo;
    constructor(memoRepo, matchRepo) {
        this.memoRepo = memoRepo;
        this.matchRepo = matchRepo;
    }
    async saveMemo(user, matchId, content) {
        const match = await this.matchRepo.findOneBy({ id: matchId });
        if (!match)
            throw new common_1.NotFoundException('경기를 찾을 수 없습니다.');
        let memo = await this.memoRepo.findOne({
            where: { user: { id: user.id }, match: { id: matchId } },
        });
        if (memo) {
            memo.content = content;
        }
        else {
            memo = this.memoRepo.create({ user, match, content });
        }
        return this.memoRepo.save(memo);
    }
    async getMyMemo(user, matchId) {
        return this.memoRepo.findOne({
            where: {
                user: { id: user.id },
                match: { id: matchId },
            },
        });
    }
};
exports.MemosService = MemosService;
exports.MemosService = MemosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(memo_entity_1.Memo)),
    __param(1, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MemosService);
//# sourceMappingURL=memos.service.js.map