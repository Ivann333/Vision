import { Module } from '@nestjs/common';
import { TimeEntryService } from './timeEntry.service';
import { TimeEntryController } from './timeEntry.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeEntry, TimeEntrySchema } from './timeEntry.schema';
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
