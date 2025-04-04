export enum MatchFormat {
  BEST_OF_3 = 'BEST_OF_3',      // 3판 2선승
  BEST_OF_5 = 'BEST_OF_5',      // 5판 3선승
  BEST_OF_7 = 'BEST_OF_7',      // 7판 4선승
  THREE_SETS = 'THREE_SETS',     // 3판
  FIVE_SETS = 'FIVE_SETS'       // 5판
}

export enum GameType {
  SINGLES = 'SINGLES',    // 단식
  DOUBLES = 'DOUBLES',    // 복식
  TEAM = 'TEAM'          // 단체전
}

export enum TournamentFormat {
  LEAGUE = 'LEAGUE',          // 리그전
  TOURNAMENT = 'TOURNAMENT',  // 토너먼트
  NONE = 'NONE'              // 없음
}

export enum LeagueStatus {
  ACCEPTING = 'ACCEPTING',    // 접수 중
  IN_PROGRESS = 'IN_PROGRESS', // 진행 중
  COMPLETED = 'COMPLETED'     // 종료
} 

export enum LeagueType {
    PARENT = 'PARENT',      // 상위 리그 (예: 남동호 탁구리그)
    SEASON = 'SEASON'       // 시즌 리그 (예: 4월 첫째주 리그)
}