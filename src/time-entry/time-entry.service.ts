import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TimeEntry, TimeEntryModelType } from './time-entry.schema';
import { User } from 'src/user/user.schema';
import { TimeEntryDto } from './dto';
import { Task, TaskModelType } from 'src/task/task.schema';

@Injectable()
export class TimeEntryService {
  constructor(
    @InjectModel(TimeEntry.name) private timeEntryModel: TimeEntryModelType,
    @InjectModel(Task.name) private taskModel: TaskModelType,
  ) {}

  async startEntry(user: User, timeEntryDto: TimeEntryDto) {
    const activeEntry = await this.timeEntryModel.findOne({
      userId: user._id,
      isActive: true,
    });

    if (activeEntry)
      throw new BadRequestException('You already have an active time entry');

    const task = await this.taskModel.findOne({
      name: timeEntryDto.taskName,
    });

    if (!task)
      throw new BadRequestException('The specified task does not exist');

    const newEntry = await this.timeEntryModel.create({
      userId: user._id,
      taskId: task._id,
    });

    return {
      success: true,
      message: 'Time entry successfully created',
      data: { timeEntry: newEntry },
    };
  }

  async stopEntry(user: User) {
    const activeEntry = await this.timeEntryModel.findOne({
      userId: user._id,
      isActive: true,
    });

    if (!activeEntry)
      throw new BadRequestException('You dont have an active time entry');

    activeEntry.isActive = false;
    activeEntry.endTime = new Date();
    await activeEntry.save();

    return {
      success: true,
      message: 'Time entry successfully saved',
      data: { timeEntry: activeEntry },
    };
  }
}
