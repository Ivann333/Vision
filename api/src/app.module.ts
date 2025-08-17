import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './task/task.module';
import { TimeEntryModule } from './time-entry/time-entry.module';
import { TimeBlockModule } from './time-block/time-block.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      errorMessage: 'Too many requests, please try again later.',
      throttlers: [
        {
          ttl: 1000,
          limit: 3,
        },
      ],
    }),
    UserModule,
    DatabaseModule,
    TaskModule,
    TimeEntryModule,
    TimeBlockModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
