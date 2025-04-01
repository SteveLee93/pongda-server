import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { League } from './league.entity';
import { Repository } from 'typeorm';
import { CreateLeagueDto } from './dto/create-league.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(League)
    private readonly leagueRepo: Repository<League>,
    private readonly usersService: UsersService,
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
}