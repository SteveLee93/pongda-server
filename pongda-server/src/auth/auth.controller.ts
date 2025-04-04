import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '이메일과 비밀번호를 입력하여 로그인합니다.' })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  // 🔐 보호된 라우트
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiOperation({ summary: '프로필 조회', description: '로그인한 사용자의 프로필 정보를 조회합니다.' })
  getProfile(@Req() req: any) {
    return req.user; // JwtStrategy의 return 값
  }
}