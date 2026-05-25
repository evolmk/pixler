import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Optional,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileLoggerService } from '../logger/file-logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(@Optional() private readonly fileLogger?: FileLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as { message?: string }).message || message;
      code = `HTTP_${status}`;
      stack = exception.stack;
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    this.fileLogger?.logApiError(status, request.method, request.url, message, stack);

    response.status(status).json({
      error: { code, message },
    });
  }
}
