import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TimeBlock, TimeBlockModelType } from './time-block.schema';
import { Task, TaskModelType } from 'src/task/task.schema';

@Injectable()
export class TimeBlockService {
  constructor(
    @InjectModel(TimeBlock.name)
    private readonly timeBlockModel: TimeBlockModelType,
    @InjectModel(Task.name)
    private readonly taskModel: TaskModelType,
  ) {}

  create() {
    return 'This action adds a new time block';
  }

  findAll() {
    return `This action returns all time blocks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} time block`;
  }

  update(id: number) {
    return `This action updates a #${id} time block`;
  }

  remove(id: number) {
    return `This action removes a #${id} time block`;
  }
}
