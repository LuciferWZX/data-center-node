import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('---默认通过', context);
    //throw new HttpException('呜呜呜呜', HttpStatus.FORBIDDEN);
    //默认全部通过
    return true;
  }
}
