import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as qs from 'qs';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './global-filters/mongo-exception.filter';
import { HttpExceptionFilter } from './global-filters/http-exception.filter';
import { AllExceptionsFilter } from './global-filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('query parser', qs.parse);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter(),
    new MongoExceptionFilter(),
  );
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
