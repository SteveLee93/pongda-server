import { MemosService } from './memos.service';
export declare class MemosController {
    private readonly memosService;
    constructor(memosService: MemosService);
    saveMemo(req: any, matchId: number, content: string): Promise<import("./memo.entity").Memo>;
    getMyMemo(req: any, matchId: number): Promise<import("./memo.entity").Memo | null>;
}
