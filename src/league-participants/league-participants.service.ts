import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeagueParticipant } from 'src/league-participants/league-participant.entity';
import { SeasonLeague } from 'src/leagues/entities/season-league.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LeagueParticipantsService {
  constructor(
    @InjectRepository(LeagueParticipant)
    private readonly leagueParticipantRepo: Repository<LeagueParticipant>,
    @InjectRepository(SeasonLeague)
    private readonly seasonLeagueRepo: Repository<SeasonLeague>,
    private readonly usersService: UsersService,
  ) {}

  async joinLeague(seasonLeagueId: number, user: User): Promise<LeagueParticipant> {
    const seasonLeague = await this.seasonLeagueRepo.findOne({ 
      where: { id: seasonLeagueId }
    });
    
    if (!seasonLeague) {
      throw new NotFoundException('리그를 찾을 수 없습니다.');
    }

    const existing = await this.leagueParticipantRepo.findOne({
      where: {
        seasonLeague: { id: seasonLeagueId },
        user: { id: user.id }
      }
    });

    if (existing) {
      throw new ConflictException('이미 참가한 리그입니다.');
    }

    const participant = this.leagueParticipantRepo.create({
      seasonLeague,
      user
    });

    return this.leagueParticipantRepo.save(participant);
  }

  async getParticipants(seasonLeagueId: number): Promise<User[]> {
    const participants = await this.leagueParticipantRepo.find({
      where: { seasonLeague: { id: seasonLeagueId } },
      relations: ['user']
    });

    return participants.map(p => p.user);
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
}
