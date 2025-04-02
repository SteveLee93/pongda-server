import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Match } from './match.entity';
  import { Repository } from 'typeorm';
  import { CreateMatchDto } from './dto/create-match.dto';
  import { League } from 'src/leagues/league.entity';
  import { User } from 'src/users/user.entity';
  
  @Injectable()
  export class MatchesService {
    constructor(
      @InjectRepository(Match)
      private matchRepo: Repository<Match>,
      @InjectRepository(League)
      private leagueRepo: Repository<League>,
      @InjectRepository(User)
      private userRepo: Repository<User>,
    ) {}
  
    async create(dto: CreateMatchDto): Promise<Match> {
        const league = await this.leagueRepo.findOneBy({ id: dto.leagueId });
        const player1 = await this.userRepo.findOneBy({ id: dto.player1Id });
        const player2 = await this.userRepo.findOneBy({ id: dto.player2Id });
      
        if (!league || !player1 || !player2) throw new NotFoundException('리그나 유저가 없습니다.');
      
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
  