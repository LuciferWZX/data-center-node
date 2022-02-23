import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: Request, res: Response, next: () => void): Promise<any> {
    console.log('验证token...');
    const authorization: string | undefined = req.header('Authorization');
    await this.authService.checkToken(authorization);
    next();
  }
}
// 函数式中间件
// export function logger(req, res, next) {
//   console.log(`Request...`);
//   next();
// };
