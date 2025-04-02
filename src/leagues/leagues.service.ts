import { Injectable, ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { League } from './league.entity';
import { Repository } from 'typeorm';
import { CreateLeagueDto } from './dto/create-league.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { FindManyOptions } from 'typeorm';
import { LeagueParticipant } from 'src/league-participants/league-participant.entity';
@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(League)
    private readonly leagueRepo: Repository<League>,
    private readonly usersService: UsersService,
    @InjectRepository(LeagueParticipant)
    private readonly leagueParticipantRepo: Repository<LeagueParticipant>,
  ) { }

  async create(dto: CreateLeagueDto, userFromJwt: any): Promise<League> {
    if (userFromJwt.role !== 'manager') {
      throw new ForbiddenException('관장만 리그를 생성할 수 있습니다.');
    }

    const user = await this.usersService.findOne(userFromJwt.userId);
    if (!user) {
      throw new ForbiddenException('사용자를 찾을 수 없습니다.');
    }

    const league = this.leagueRepo.create({
      name: dto.name,
      description: dto.description || '',
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      createdBy: user
    });

    return this.leagueRepo.save(league);
  }
 

  async findAll(): Promise<League[]> {
    const options: FindManyOptions<League> = {
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    };
    return this.leagueRepo.find(options);
  }

  async joinLeague(leagueId: number, user: User): Promise<LeagueParticipant> {
    // 리그 존재 여부 확인
    const league = await this.leagueRepo.findOne({ 
        where: { id: leagueId }
    });
    if (!league) {
        throw new NotFoundException('리그를 찾을 수 없습니다.');
    }

    // 이미 참가했는지 확인
    console.log('Checking participation for:', { userId: user.id, leagueId });
    
    const existing = await this.leagueParticipantRepo.findOne({
        where: {
            league: { id: leagueId },
            user: { id: user.id }
        }
    });

    console.log('Existing participant:', existing);

    if (existing) {
        throw new ConflictException('이미 참가한 리그입니다.');
    }

    // 새로운 참가자 정보 생성
    const participant = this.leagueParticipantRepo.create();
    participant.league = league;
    
    const userEntity = await this.usersService.findOne(user.id);
    if (!userEntity) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    participant.user = userEntity;

    // 저장
    const savedParticipant = await this.leagueParticipantRepo.save(participant);

    // 저장된 참가자 정보를 relations와 함께 조회
    const result = await this.leagueParticipantRepo.findOne({
        where: { id: savedParticipant.id },
        relations: {
            user: true,
            league: true
        }
    });
    
    if (!result) {
        throw new NotFoundException('참가자 정보를 찾을 수 없습니다.');
    }
    
    return result;
  }
  
  async getParticipants(leagueId: number): Promise<User[]> {
    const league = await this.leagueRepo.findOne({ where: { id: leagueId } });
    if (!league) {
      throw new NotFoundException('리그를 찾을 수 없습니다.');
    }
  
    const participants = await this.leagueParticipantRepo.find({
      where: { league: { id: leagueId } },
      relations: ['user'],
    });
  
    return participants.map(p => p.user);
  }
}