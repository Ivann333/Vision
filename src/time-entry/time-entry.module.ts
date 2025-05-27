import { Module } from '@nestjs/common';
import { TimeEntryService } from './time-entry.service';
import { TimeEntryController } from './time-entry.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeEntry, TimeEntrySchema } from './time-entry.schema';
import { Task, TaskSchema } from 'src/task/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TimeEntry.name, schema: TimeEntrySchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  providers: [TimeEntryService],
  controllers: [TimeEntryController],
})
export class TimeEntryModule {}
