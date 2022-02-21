import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RestRes } from '../interceptors/transform.interceptor';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const _response: RestRes<any> = exception.response;
    response.status(status).json({
      code: _response.code || 10000,
      msg: _response.msg,
      data: _response.data === undefined ? request.url : _response.data,
    });
  }
}
