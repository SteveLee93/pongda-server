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
Object.defineProperty(exports, "__esModule", { value: true });
exports.League = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const league_participant_entity_1 = require("../league-participants/league-participant.entity");
const swagger_1 = require("@nestjs/swagger");
let League = class League {
    id;
    name;
    description;
    startDate;
    endDate;
    createdBy;
    createdAt;
    participants;
};
exports.League = League;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, swagger_1.ApiProperty)({ description: '리그 ID', example: 1 }),
    __metadata("design:type", Number)
], League.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ description: '리그 이름', example: '리그 이름' }),
    __metadata("design:type", String)
], League.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: '리그 설명', example: '리그 설명' }),
    __metadata("design:type", String)
], League.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, swagger_1.ApiProperty)({ description: '리그 시작일', example: '2025-01-01' }),
    __metadata("design:type", Date)
], League.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, swagger_1.ApiProperty)({ description: '리그 종료일', example: '2025-01-01' }),
    __metadata("design:type", Date)
], League.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.leaguesCreated, {
        nullable: false,
        onDelete: 'CASCADE'
    }),
    (0, swagger_1.ApiProperty)({ description: '리그 생성자', example: '리그 생성자' }),
    __metadata("design:type", user_entity_1.User)
], League.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)({ description: '리그 생성일', example: '2025-01-01' }),
    __metadata("design:type", Date)
], League.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => league_participant_entity_1.LeagueParticipant, lp => lp.league),
    (0, swagger_1.ApiProperty)({ description: '리그 참여자', example: '리그 참여자' }),
    __metadata("design:type", Array)
], League.prototype, "participants", void 0);
exports.League = League = __decorate([
    (0, typeorm_1.Entity)()
], League);
//# sourceMappingURL=league.entity.js.map