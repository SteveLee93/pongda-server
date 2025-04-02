"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesModule = void 0;
const common_1 = require("@nestjs/common");
const matches_service_1 = require("./matches.service");
const matches_controller_1 = require("./matches.controller");
const typeorm_1 = require("@nestjs/typeorm");
const match_entity_1 = require("./match.entity");
const match_set_entity_1 = require("./match-set.entity");
const league_entity_1 = require("../leagues/league.entity");
const user_entity_1 = require("../users/user.entity");
const leagues_service_1 = require("../leagues/leagues.service");
let MatchesModule = class MatchesModule {
};
exports.MatchesModule = MatchesModule;
exports.MatchesModule = MatchesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([match_entity_1.Match, match_set_entity_1.MatchSet, league_entity_1.League, user_entity_1.User])],
        providers: [matches_service_1.MatchesService, leagues_service_1.LeaguesService],
        controllers: [matches_controller_1.MatchesController],
    })
], MatchesModule);
//# sourceMappingURL=matches.module.js.map