"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const memos_service_1 = require("./memos.service");
const memos_controller_1 = require("./memos.controller");
const memo_entity_1 = require("./memo.entity");
const match_entity_1 = require("../matches/match.entity");
let MemosModule = class MemosModule {
};
exports.MemosModule = MemosModule;
exports.MemosModule = MemosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([memo_entity_1.Memo, match_entity_1.Match])
        ],
        providers: [memos_service_1.MemosService],
        controllers: [memos_controller_1.MemosController]
    })
], MemosModule);
//# sourceMappingURL=memos.module.js.map