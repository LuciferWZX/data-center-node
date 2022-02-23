import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
@Catch(QueryFailedError)
export class SqlExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.BAD_REQUEST).json({
      code: exception.errno,
      msg: exception.sqlMessage,
      data: null,
    });
  }
}
