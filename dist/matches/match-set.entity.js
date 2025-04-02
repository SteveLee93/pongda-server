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
exports.MatchSet = void 0;
const typeorm_1 = require("typeorm");
const match_entity_1 = require("./match.entity");
let MatchSet = class MatchSet {
    id;
    match;
    setNumber;
    scorePlayer1;
    scorePlayer2;
};
exports.MatchSet = MatchSet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MatchSet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => match_entity_1.Match, match => match.sets, { onDelete: 'CASCADE' }),
    __metadata("design:type", match_entity_1.Match)
], MatchSet.prototype, "match", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchSet.prototype, "setNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchSet.prototype, "scorePlayer1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MatchSet.prototype, "scorePlayer2", void 0);
exports.MatchSet = MatchSet = __decorate([
    (0, typeorm_1.Entity)()
], MatchSet);
//# sourceMappingURL=match-set.entity.js.map