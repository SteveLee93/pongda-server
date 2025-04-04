import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    Inject,
    forwardRef
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Match } from './match.entity';
  import { Repository } from 'typeorm';
  import { CreateMatchDto } from './dto/create-match.dto';
  import { SeasonLeague } from 'src/leagues/entities/season-league.entity';
  import { User } from 'src/users/user.entity';
  import { SeasonLeaguesService } from 'src/leagues/services/season-leagues.service';
  import { CreateQualifierMatchDto } from './dto/create-qualifier-match.dto';
  import { LeagueStatus, TournamentFormat } from 'src/leagues/enums/league.enum';

  @Injectable()
  export class MatchesService {
    constructor(
      @InjectRepository(Match)
      private matchRepo: Repository<Match>,
      @InjectRepository(SeasonLeague)
      private seasonLeagueRepo: Repository<SeasonLeague>,
      @InjectRepository(User)
      private userRepo: Repository<User>,
      @Inject(forwardRef(() => SeasonLeaguesService))
      private seasonLeagueService: SeasonLeaguesService,
    ) {}
  
    async create(dto: CreateMatchDto): Promise<Match> {
        const seasonLeague = await this.seasonLeagueRepo.findOneBy({ id: dto.seasonLeagueId });
        const player1 = await this.userRepo.findOneBy({ id: dto.player1Id });
        const player2 = await this.userRepo.findOneBy({ id: dto.player2Id });
        

        if (!seasonLeague || !player1 || !player2) {
          throw new NotFoundException('리그나 유저가 없습니다.');
        }

        // 동일 플레이어 검증 추가
        if (player1.id === player2.id) {
          throw new BadRequestException('같은 플레이어끼리는 매치를 할 수 없습니다.');
        }
      
        // 리그 참가자 체크
        const isP1InLeague = await this.seasonLeagueService.isUserInLeague(player1.id, seasonLeague.id);
        const isP2InLeague = await this.seasonLeagueService.isUserInLeague(player2.id, seasonLeague.id);

        if (!isP1InLeague || !isP2InLeague) {
            throw new ForbiddenException('선수 중 최소 한 명이 리그 참가자가 아닙니다.');
        }

        let winsP1 = 0;
        let winsP2 = 0;
      
        const sets = dto.sets.map(set => {
          if (set.scorePlayer1 > set.scorePlayer2) winsP1++;
          else if (set.scorePlayer2 > set.scorePlayer1) winsP2++;
          return {
            ...set,
          };
        });
      
        const winner = winsP1 > winsP2 ? player1 : player2;
      
        const match = this.matchRepo.create({
          seasonLeague,
          player1,
          player2,
          scorePlayer1: winsP1,
          scorePlayer2: winsP2,
          winner,
          sets,
        });
      
        return this.matchRepo.save(match);
      }

      async findAll(): Promise<Match[]> {
        return this.matchRepo.find({
          relations: ['seasonLeague', 'player1', 'player2', 'winner', 'sets'],
          order: { scheduledDateTime: 'DESC' },
        });
      }

      async findByUser(userId: number): Promise<Match[]> {
        return this.matchRepo.find({
          where: [
            { player1: { id: userId } },
            { player2: { id: userId } },
          ],
          relations: ['seasonLeague', 'player1', 'player2', 'winner', 'sets'],
          order: { scheduledDateTime: 'DESC' },
        });
      }
      
      async findOneById(id: number): Promise<Match> {
        const match = await this.matchRepo.findOne({
          where: { id },
          relations: ['seasonLeague', 'player1', 'player2', 'winner', 'sets'],
        });
      
        if (!match) throw new NotFoundException('경기를 찾을 수 없습니다.');
      
        return match;
      }

      async createQualifierMatch(dto: CreateQualifierMatchDto): Promise<Match> {
        const seasonLeague = await this.seasonLeagueRepo.findOneBy({ id: dto.seasonLeagueId });
        if (!seasonLeague) throw new NotFoundException('리그를 찾을 수 없습니다.');

        // 예선 단계 검증
        if (seasonLeague.status !== LeagueStatus.IN_PROGRESS) {
          throw new BadRequestException('진행 중인 리그가 아닙니다.');
        }

        const match = this.matchRepo.create({
          seasonLeague,
          stage: TournamentFormat.LEAGUE,
          qualifierGroupNumber: dto.groupNumber,
          scheduledDateTime: new Date(dto.scheduledDateTime),
          // ... 나머지 매치 정보 설정
        });

        return this.matchRepo.save(match);
      }

      async getQualifierStandings(seasonLeagueId: number, groupNumber?: number) {
        const matches = await this.matchRepo.find({
          where: {
            seasonLeague: { id: seasonLeagueId },
            stage: TournamentFormat.LEAGUE,
            ...(groupNumber !== undefined && { qualifierGroupNumber: groupNumber })
          },
          relations: ['player1', 'player2', 'winner']
        });

        // 승점 계산
        const standings = {};
        matches.forEach(match => {
          // 승자에게 1점
          if (match.winner) {
            const winnerId = match.winner.id;
            standings[winnerId] = (standings[winnerId] || 0) + 1;
          }
        });

        return standings;
      }

      async generatePlayoffMatches(seasonLeagueId: number): Promise<void> {
        const seasonLeague = await this.seasonLeagueRepo.findOne({
          where: { id: seasonLeagueId },
          relations: ['participants']
        });

        if (!seasonLeague) {
          throw new NotFoundException('리그를 찾을 수 없습니다.');
        }

        if (seasonLeague.playoffFormat === TournamentFormat.TOURNAMENT) {
          // 예선 성적 기준으로 본선 진출자 선정
          const qualifiers = await this.getQualifiedPlayers(seasonLeagueId);
          
          // 토너먼트 대진표 생성
          const rounds = Math.ceil(Math.log2(qualifiers.length));
          // 8강(8), 4강(4), 결승(2) 등의 라운드 생성
          const matchesNeeded = Math.pow(2, rounds - 1);

          for (let i = 0; i < matchesNeeded / 2; i++) {
            const match = this.matchRepo.create({
              seasonLeague: seasonLeague,
              stage: TournamentFormat.TOURNAMENT,
              playoffRound: rounds,
              player1: qualifiers[i],
              player2: qualifiers[qualifiers.length - 1 - i],
              scheduledDateTime: new Date() // 실제로는 적절한 일정 설정 필요
            });
            await this.matchRepo.save(match);
          }
        }
      }

      private async getQualifiedPlayers(seasonLeagueId: number): Promise<User[]> {
        // 각 예선 그룹의 상위 선수들을 선발
        const standings = await this.getQualifierStandings(seasonLeagueId, undefined);
        // 적절한 로직으로 본선 진출자 선정
        return [];
      }
  }
  