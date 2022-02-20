import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum ResCode {
  success = 0,
  failed = 1,
}

export interface RestRes<T> {
  code?: ResCode;
  data: T;
  msg?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, RestRes<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<RestRes<T>> {
    return next.handle().pipe(
      map((data: RestRes<T>) => {
        return {
          code: data.code || ResCode.success,
          data: data.data,
          msg: data.msg || '',
        };
      }),
    );
  }
}
