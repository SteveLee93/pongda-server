import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Match } from './match.entity';
  import { Repository } from 'typeorm';
  import { CreateMatchDto } from './dto/create-match.dto';
  import { League } from 'src/leagues/league.entity';
  import { User } from 'src/users/user.entity';
  import { LeaguesService } from 'src/leagues/leagues.service';

  @Injectable()
  export class MatchesService {
    constructor(
      @InjectRepository(Match)
      private matchRepo: Repository<Match>,
      @InjectRepository(League)
      private leagueRepo: Repository<League>,
      @InjectRepository(User)
      private userRepo: Repository<User>,
      private leagueService: LeaguesService,
    ) {}
  
    async create(dto: CreateMatchDto): Promise<Match> {
        const league = await this.leagueRepo.findOneBy({ id: dto.leagueId });
        const player1 = await this.userRepo.findOneBy({ id: dto.player1Id });
        const player2 = await this.userRepo.findOneBy({ id: dto.player2Id });
        

        if (!league || !player1 || !player2) {
          throw new NotFoundException('리그나 유저가 없습니다.');
        }

        // 동일 플레이어 검증 추가
        if (player1.id === player2.id) {
          throw new BadRequestException('같은 플레이어끼리는 매치를 할 수 없습니다.');
        }
      
        // 리그 참가자 체크
        const isP1InLeague = await this.leagueService.isUserInLeague(player1.id, league.id);
        const isP2InLeague = await this.leagueService.isUserInLeague(player2.id, league.id);

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
          league,
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
          relations: ['league', 'player1', 'player2', 'winner', 'sets'],
          order: { matchDate: 'DESC' },
        });
      }

      async findByUser(userId: number): Promise<Match[]> {
        return this.matchRepo.find({
          where: [
            { player1: { id: userId } },
            { player2: { id: userId } },
          ],
          relations: ['league', 'player1', 'player2', 'winner', 'sets'],
          order: { matchDate: 'DESC' },
        });
      }
      
      async findOneById(id: number): Promise<Match> {
        const match = await this.matchRepo.findOne({
          where: { id },
          relations: ['league', 'player1', 'player2', 'winner', 'sets'],
        });
      
        if (!match) throw new NotFoundException('경기를 찾을 수 없습니다.');
      
        return match;
      }
  }
  