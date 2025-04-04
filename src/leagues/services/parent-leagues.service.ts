import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParentLeague } from 'src/leagues/entities/parent-league.entity';
import { CreateParentLeagueDto } from 'src/leagues/dto/create-parent-league.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ParentLeaguesService {
  constructor(
    @InjectRepository(ParentLeague)
    private readonly parentLeagueRepo: Repository<ParentLeague>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateParentLeagueDto, userFromJwt: any): Promise<ParentLeague> {
    if (userFromJwt.role !== 'manager') {
      throw new ForbiddenException('관장만 리그를 생성할 수 있습니다.');
    }

    const user = await this.usersService.findOne(userFromJwt.userId);
    if (!user) {
      throw new ForbiddenException('사용자를 찾을 수 없습니다.');
    }

    const league = this.parentLeagueRepo.create({
      ...dto,
      createdBy: user
    });

    return this.parentLeagueRepo.save(league);
  }

  async findAll(): Promise<ParentLeague[]> {
    return this.parentLeagueRepo.find({
      relations: ['createdBy', 'seasonLeagues'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<ParentLeague> {
    const league = await this.parentLeagueRepo.findOne({
      where: { id },
      relations: ['createdBy', 'seasonLeagues']
    });

    if (!league) {
      throw new NotFoundException('상위 리그를 찾을 수 없습니다.');
    }

    return league;
  }
}
