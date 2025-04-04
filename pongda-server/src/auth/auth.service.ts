import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userData: { email: string; password: string }) {
    const user = await this.validateUser(userData.email, userData.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { 
      email: user.email,
      sub: user.id,  // userId -> id (데이터베이스 컬럼명과 일치)
      role: user.role 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
