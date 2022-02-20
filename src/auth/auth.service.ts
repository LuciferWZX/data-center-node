import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from '../user/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<User | null> {
    console.log(1);
    const user = await this.userService.findOneByPassword(username, password);
    if (user && user.password === password) {
      delete user.password;
      return user;
    }
    return null;
  }
  async login(user: User): Promise<{ token: string }> {
    console.log(2);
    const payload = { username: user.username, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
