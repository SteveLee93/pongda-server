import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeasonLeague } from 'src/leagues/entities/season-league.entity';
import { ParentLeague } from 'src/leagues/entities/parent-league.entity';
import { UsersService } from 'src/users/users.service';
import { CreateSeasonLeagueDto } from 'src/leagues/dto/create-season-league.dto';
import { LeagueParticipant } from 'src/league-participants/league-participant.entity';

@Injectable()
export class SeasonLeaguesService {
  constructor(
    @InjectRepository(SeasonLeague)
    private readonly seasonLeagueRepo: Repository<SeasonLeague>,
    @InjectRepository(ParentLeague)
    private readonly parentLeagueRepo: Repository<ParentLeague>,
    private readonly usersService: UsersService,
    @InjectRepository(LeagueParticipant)
    private readonly leagueParticipantRepo: Repository<LeagueParticipant>,
  ) {}

  async create(dto: CreateSeasonLeagueDto, userFromJwt: any): Promise<SeasonLeague> {
    if (userFromJwt.role !== 'manager') {
      throw new ForbiddenException('관장만 리그를 생성할 수 있습니다.');
    }

    const parentLeague = await this.parentLeagueRepo.findOne({
      where: { id: dto.parentLeagueId }
    });

    if (!parentLeague) {
      throw new NotFoundException('상위 리그를 찾을 수 없습니다.');
    }

    const user = await this.usersService.findOne(userFromJwt.userId);
    if (!user) {
      throw new ForbiddenException('사용자를 찾을 수 없습니다.');
    }

    const league = this.seasonLeagueRepo.create({
      ...dto,
      parentLeague,
      createdBy: user,
      startDateTime: new Date(dto.startDateTime)
    });

    return this.seasonLeagueRepo.save(league);
  }

  async findByParentLeague(parentLeagueId: number): Promise<SeasonLeague[]> {
    return this.seasonLeagueRepo.find({
      where: { parentLeague: { id: parentLeagueId } },
      relations: ['createdBy', 'parentLeague'],
      order: { startDateTime: 'DESC' }
    });
  }

  async isUserInLeague(userId: number, seasonLeagueId: number): Promise<boolean> {
    const count = await this.leagueParticipantRepo.count({
      where: {
        user: { id: userId },
        seasonLeague: { id: seasonLeagueId }
      }
    });
    return count > 0;
  }

  async findAll(): Promise<SeasonLeague[]> {
    return this.seasonLeagueRepo.find({
      relations: [
        'createdBy',
        'parentLeague',
        'participants',
        'participants.user'
      ],
      order: {
        startDateTime: 'DESC'
      },
      select: {
        id: true,
        name: true,
        description: true,
        startDateTime: true,
        status: true,
        matchFormat: true,
        gameType: true,
        qualifierFormat: true,
        playoffFormat: true,
        parentLeague: {
          id: true,
          name: true,
          city: true,
          district: true
        },
        createdBy: {
          id: true,
          nickname: true
        }
      }
    });
  }

  // ... 기존의 다른 메서드들 (참가자 관리, 예선/본선 관리 등)
}
