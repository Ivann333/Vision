import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument, TaskModelType } from './task.schema';
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
    const { type, startDate } = createTaskDto;

    this.ensureValidStartDate(startDate, type);
    await this.ensureMaxTasksLimit(user, startDate, type);

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

    const allowedFields = Object.keys(this.taskModel.schema.paths);
    tasksQuery = applySort(tasksQuery, query, allowedFields);
    tasksQuery = applySelectFields(tasksQuery, query, allowedFields);
    tasksQuery = applyPagination(tasksQuery, query);
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
    const task = await this.getTaskOrFail(id);
    this.ensureUserIsOwner(task, user._id.toString());

    return {
      success: true,
      message: 'Task successfully retrieved',
      data: { task },
    };
  }

  async update(user: User, id: string, updateTaskDto: UpdateTaskDto) {
    const { startDate, type: newType } = updateTaskDto;

    const task = await this.getTaskOrFail(id);
    this.ensureUserIsOwner(task, user._id.toString());

    if (startDate) {
      const type = newType || task.type;
      this.ensureValidStartDate(startDate, type);
      await this.ensureMaxTasksLimit(user, startDate, type);
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
    const task = await this.getTaskOrFail(id);
    this.ensureUserIsOwner(task, user._id.toString());

    await task.deleteOne();

    return {
      success: true,
      message: 'Task successfully deleted',
      data: null,
    };
  }

  private ensureUserIsOwner(task: TaskDocument, userId: string) {
    if (task.userId.toString() !== userId)
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
  }

  private async getTaskOrFail(taskId: string) {
    const task = await this.taskModel.findById(taskId);

    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  private async ensureMaxTasksLimit(
    user: User,
    startDate: Date | string,
    type: TaskType,
  ) {
    const convertedStartDate = new Date(startDate);

    const endDate = this.taskModel.calculateEndDate(convertedStartDate, type);

    const tasks = await this.taskModel.find({
      userId: user._id,
      startDate: startDate,
      endDate: endDate,
    });

    if (tasks && tasks.length >= 3)
      throw new BadRequestException(
        `You already have 3 ${type} tasks for ${convertedStartDate.toISOString().slice(0, 10)} - ${endDate.toISOString().slice(0, 10)}`,
      );
  }

  private ensureValidStartDate(startDate: Date | string, type: TaskType) {
    const convertedStartDate = new Date(startDate);
    if (type === TaskType.Annual) {
      if (
        convertedStartDate.getMonth() !== 0 ||
        convertedStartDate.getDate() !== 1
      )
        throw new BadRequestException(
          'Annual task must start on January 1st (format: YYYY-01-01)',
        );
    }
    if (type === TaskType.Monthly) {
      if (convertedStartDate.getDate() !== 1)
        throw new BadRequestException(
          'Monthly task must start on the 1st day of the month (format: YYYY-MM-01)',
        );
    }
    if (type === TaskType.Weekly) {
      if (convertedStartDate.getDay() !== 1)
        throw new BadRequestException('Weekly task must start on Monday');
    }
  }
}
