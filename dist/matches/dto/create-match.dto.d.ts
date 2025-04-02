declare class MatchSetDto {
    setNumber: number;
    scorePlayer1: number;
    scorePlayer2: number;
}
export declare class CreateMatchDto {
    leagueId: number;
    player1Id: number;
    player2Id: number;
    sets: MatchSetDto[];
}
export {};
