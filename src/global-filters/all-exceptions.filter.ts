import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    let logMessage = 'Something went wrong!';
    let stack: string | undefined;

    if (exception instanceof Error) {
      logMessage = exception.message;
      stack = exception.stack;
    }

    this.logger.error(
      `Exception {${request.originalUrl}, ${request.method}} ${logMessage}, status: ${status}`,
      stack,
    );

    response.status(status).json({
      success: false,
      message: 'Something went wrong!',
      data: {},
    });
  }
}
