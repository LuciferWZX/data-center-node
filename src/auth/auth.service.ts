import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from '../user/interfaces/user.interface';
import { JWT_CONSTANTS } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  //用户登录时查看用户的账户密码是否正确
  async validateUser(username: string, password: string): Promise<User | null> {
    return await this.userService.upLogin(username, password);
    //return await this.userService.findOneByPassword(username, password);
  }
  //用户登录之后生成token
  async login(user: User): Promise<{ token: string }> {
    const payload = { username: user.username, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
  async checkToken(authorization?: string) {
    if (!authorization) {
      throw new HttpException(
        {
          code: 10002,
          msg: '请先登录',
          data: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = authorization.split(' ')[1];
    let isLogin = true;
    try {
      const { sub } = await this.jwtService.verify(token, {
        secret: JWT_CONSTANTS.secret,
      });
      console.log('检查出来的sub', sub);
      //通过上面解析出来的id去缓存里面去查询用户，然后比较token是否一样是的话说明是最新的token
      //否则目前的是最老的token
      const user = await this.userService.findOneById(sub);
      if (!user || user.token !== token) {
        isLogin = false;
      }
    } catch (e: any) {
      console.log('token过期时间为:', e.expiredAt);
      throw new HttpException(
        {
          code: 10001,
          msg: '用户登录时间已过期',
          data: e.expiredAt,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!isLogin) {
      throw new HttpException(
        {
          code: 10002,
          msg: '请重新登录',
          data: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
