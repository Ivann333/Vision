import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { TimeEntry, TimeEntryModelType } from './time-entry.schema';
import { User } from 'src/user/user.schema';
import { Task, TaskModelType } from 'src/task/task.schema';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';

@Injectable()
export class TimeEntryService {
  constructor(
    @InjectModel(TimeEntry.name) private timeEntryModel: TimeEntryModelType,
    @InjectModel(Task.name) private taskModel: TaskModelType,
  ) {}

  async create(user: User, createTimeEntryDto: CreateTimeEntryDto) {
    const {
      startTime: startTimeISOString,
      endTime: endTimeISOString,
      taskId,
      description,
    } = createTimeEntryDto;

    const startTime = new Date(startTimeISOString);
    const endTime = endTimeISOString ? new Date(endTimeISOString) : undefined;

    if (!endTime) {
      //check for active entries
      const activeEntry = await this.getActiveTimeEntry(user._id.toString());

      if (activeEntry)
        throw new BadRequestException('You already have an active time entry');
    } else {
      if (endTime <= startTime) {
        throw new BadRequestException('endTime must be after startTime');
      }
    }
    if (taskId) await this.ensureTaskExists(taskId);

    const newEntry = await this.timeEntryModel.create({
      userId: user._id,
      taskId,
      startTime: startTime,
      endTime: endTime,
      description,
    });

    return {
      success: true,
      message: 'Time entry successfully created',
      data: { timeEntry: newEntry },
    };
  }

  async getActiveTimeEntry(userId: string) {
    const activeEntry = await this.timeEntryModel.findOne({
      userId,
      isActive: true,
    });

    return activeEntry;
  }

  async ensureTaskExists(taskId: string) {
    const task = await this.taskModel.findById(taskId);

    if (!task)
      throw new BadRequestException('The specified task does not exist');
  }
}
