import { Controller, Post, Body, Get, Param, UseGuards, Req, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: number;
  };
}

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: '사용자 생성', description: '새로운 사용자를 생성합니다.' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;  // 이메일 중복 에러
      }
      throw new BadRequestException('사용자 생성에 실패했습니다.');
    }
  }

  @Get()
  @ApiOperation({ summary: '모든 사용자 조회', description: '모든 사용자를 조회합니다.' })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/stats')
  @ApiOperation({ summary: '내 통계 조회', description: '내 통계를 조회합니다.' })
  async getMyStats(@Req() req: RequestWithUser) {
    return this.usersService.getMyStats(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: '내 페이지 조회', description: '내 페이지를 조회합니다.' })
  async getMe(@Req() req: RequestWithUser) {
    return this.usersService.getMyPage(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '사용자 조회', description: '특정 사용자를 조회합니다.' })
  async getUserById(@Param('id') id: number): Promise<User | null> {
    return this.usersService.findOne(id);
  }
}