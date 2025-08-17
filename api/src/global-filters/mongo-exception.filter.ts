import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { MongoError, MongoServerError } from 'mongodb';
import { Error, MongooseError } from 'mongoose';

@Catch(MongoError, MongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MongoExceptionFilter.name);

  catch(exception: MongoError | MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Something went wrong!';
    const stack = exception.stack;

    if (exception instanceof MongoServerError) {
      if (exception.code === 11000) {
        status = HttpStatus.BAD_REQUEST;
        const fields = Object.keys(exception.keyValue);
        message = `${fields.join(' ')} already exists`;
      }
    }
    if (exception instanceof Error.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Validation failed for: ${Object.keys(exception.errors).join(' ')}`;
    }
    if (exception instanceof Error.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid ${exception.path}: ${exception.value}`;
    }

    this.logger.error(
      `Exception {${request.originalUrl}, ${request.method}} ${message.toString()}, status: ${status}`,
      stack,
    );

    response.status(status).json({
      success: false,
      message: message,
      data: {},
    });
  }
}
