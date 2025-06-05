import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskModelType } from './task.schema';
import { User } from 'src/user/user.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskType } from './enums/task-type.enum';
import { applyPagination } from 'src/common/helpers/apply-pagination.helper';
import { FindAllTasksQueryDto } from './dto/find-all-tasks-query.dto';
import { applySort } from 'src/common/helpers/apply-sort.helper';
import { applySelectFields } from 'src/common/helpers/apply-select-fields.helper';
import { applyQueryFilter } from 'src/common/helpers/apply-query-filter.helper';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: TaskModelType) {}
  async create(user: User, createTaskDto: CreateTaskDto) {
    const { type } = createTaskDto;
    const startDate = new Date(createTaskDto.startDate);

    this.ensureValidStartDate(startDate, type);
    await this.ensureMaxTasksLimit(startDate, type);

    const newTask = await this.taskModel.create({
      userId: user._id,
      ...createTaskDto,
    });

    return {
      success: true,
      message: 'Task successfully created',
      data: { task: newTask },
    };
  }

  async findAll(user: User, query: FindAllTasksQueryDto) {
    let tasksQuery = this.taskModel.find({ userId: user._id });

    tasksQuery = applyPagination(tasksQuery, query);
    tasksQuery = applySort(
      tasksQuery,
      query,
      Object.keys(this.taskModel.schema.paths),
    );
    tasksQuery = applySelectFields(
      tasksQuery,
      query,
      Object.keys(this.taskModel.schema.paths),
    );

    tasksQuery = applyQueryFilter(tasksQuery, query);

    const tasks = await tasksQuery;

    return {
      success: true,
      message: 'Tasks successfully retrieved',
      results: tasks.length,
      data: { tasks },
    };
  }

  async findOne(user: User, id: string) {
    const task = await this.taskModel.findById(id);

    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== user._id)
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );

    return {
      success: true,
      message: 'Task successfully retrieved',
      data: { task },
    };
  }

  async update(user: User, id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskModel.findById(id);

    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== user._id)
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );

    if (updateTaskDto.startDate) {
      const startDate = new Date(updateTaskDto.startDate);
      const type = updateTaskDto.type || task.type;

      this.ensureValidStartDate(startDate, type);
      await this.ensureMaxTasksLimit(startDate, type);
    }

    const updatedTask = await this.taskModel.findByIdAndUpdate(
      id,
      { ...updateTaskDto },
      {
        new: true,
        runValidators: true,
      },
    );

    return {
      success: true,
      message: 'Task successfully updated',
      data: { task: updatedTask },
    };
  }

  async remove(user: User, id: string) {
    const task = await this.taskModel.findById(id);

    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== user._id)
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );

    await task.deleteOne();

    return {
      success: true,
      message: 'Task successfully deleted',
      data: null,
    };
  }

  async ensureMaxTasksLimit(startDate: Date, type: TaskType) {
    const endDate = this.taskModel.calculateEndDate(startDate, type);

    const tasks = await this.taskModel.find({
      startDate: startDate,
      endDate: endDate,
    });

    if (tasks && tasks.length >= 3)
      throw new BadRequestException(
        `You already have 3 ${type} tasks for ${startDate.toISOString().slice(0, 10)} - ${endDate.toISOString().slice(0, 10)}`,
      );
  }

  ensureValidStartDate(startDate: Date, type: TaskType) {
    if (type === TaskType.Annual) {
      if (startDate.getMonth() !== 0 || startDate.getDate() !== 1)
        throw new BadRequestException(
          'Annual task must start on January 1st (format: YYYY-01-01)',
        );
    }
    if (type === TaskType.Monthly) {
      if (startDate.getDate() !== 1)
        throw new BadRequestException(
          'Monthly task must start on the 1st day of the month (format: YYYY-MM-01)',
        );
    }
    if (type === TaskType.Weekly) {
      if (startDate.getDay() !== 1)
        throw new BadRequestException('Weekly task must start on Monday');
    }
  }
}
