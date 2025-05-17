import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskModelType } from './task.schema';
import { User } from 'src/user/user.schema';
import { TaskDto } from './dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: TaskModelType) {}
  async create(user: User, taskDto: TaskDto) {
    const newTask = await this.taskModel.create({
      userId: user._id,
      ...taskDto,
    });
    return { message: 'Task successfully created', data: { task: newTask } };
  }
}
