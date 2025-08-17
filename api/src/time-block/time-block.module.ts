import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeBlockService } from './time-block.service';
import { TimeBlockController } from './time-block.controller';
import { TimeBlock, TimeBlockSchema } from './time-block.schema';
import { Task, TaskSchema } from 'src/task/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TimeBlock.name, schema: TimeBlockSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [TimeBlockController],
  providers: [TimeBlockService],
})
export class TimeBlockModule {}
