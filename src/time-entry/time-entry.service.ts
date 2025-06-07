import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  TimeEntry,
  TimeEntryDocument,
  TimeEntryModelType,
} from './time-entry.schema';
import { User } from 'src/user/user.schema';
import { Task, TaskModelType } from 'src/task/task.schema';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { Types } from 'mongoose';

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
  async update(user: User, id: string, updateTimeEntryDto: UpdateTimeEntryDto) {
    const { startTime: startTimeISO, endTime: endTimeISO } = updateTimeEntryDto;

    const timeEntry = await this.getTimeEntryOrFail(id);
    this.ensureUserIsOwner(timeEntry, user._id.toString());

    const startTime = startTimeISO || timeEntry.startTime;
    const endTime = endTimeISO || timeEntry.endTime;

    if (endTime) this.ensureEndTimeAfterStartTime(startTime, endTime);

    for (const [key, value] of Object.entries(updateTimeEntryDto)) {
      if (value) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timeEntry[key] = value;
      }
    }

    const updatedTimeEntry = await timeEntry.save();

    return {
      success: true,
      message: 'Time entry successfully updated',
      data: { timeEntry: updatedTimeEntry },
    };
  }

  ensureEndTimeAfterStartTime(
    startTime: string | Date,
    endTime: string | Date,
  ) {
    const endTimeDate = new Date(endTime);
    const startTimeDate = new Date(startTime);

    if (endTimeDate <= startTimeDate)
      throw new BadRequestException('endTime must be after startTime');
  }

  async getTimeEntryOrFail(timeEntryId: string) {
    const timeEntry = await this.timeEntryModel.findById(timeEntryId);

    if (!timeEntry) throw new NotFoundException('Time entry not found');

    return timeEntry;
  }

  ensureUserIsOwner(timeEntry: TimeEntryDocument, userId: string) {
    if (timeEntry.userId.toString() !== userId)
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
  }

  async getActiveTimeEntry(userId: string) {
    const activeEntry = await this.timeEntryModel.findOne({
      userId: new Types.ObjectId(userId),
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
