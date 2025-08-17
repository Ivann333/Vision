import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let message: string | string[] = 'Bad request';

    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'object') {
      if ('message' in exceptionResponse) {
        if (exceptionResponse.message instanceof Array) {
          message = exceptionResponse.message.join('. ');
        } else {
          message = exceptionResponse.message as string;
        }
      }
    }
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    this.logger.error(
      `Exception {${request.originalUrl}, ${request.method}} ${message.toString()}, status: ${status}`,
      exception.stack,
    );

    response.status(status).json({
      success: false,
      message: message,
      data: {},
    });
  }
}
