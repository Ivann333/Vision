import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TimeEntry, TimeEntryModelType } from './time-entry.schema';
import { User } from 'src/user/user.schema';
import { Task, TaskModelType } from 'src/task/task.schema';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { FindAllTimeEntriesQueryDto } from './dto/find-all-time-entries-query.dto';
import { applyPagination } from 'src/common/helpers/apply-pagination.helper';
import { applySort } from 'src/common/helpers/apply-sort.helper';
import { applySelectFields } from 'src/common/helpers/apply-select-fields.helper';
import { applyQueryFilter } from 'src/common/helpers/apply-query-filter.helper';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { ensureEndTimeAfterStartTime } from 'src/common/helpers/ensure-end-time-after-start-time.helper';

@Injectable()
export class TimeEntryService {
  constructor(
    @InjectModel(TimeEntry.name) private timeEntryModel: TimeEntryModelType,
    @InjectModel(Task.name) private taskModel: TaskModelType,
  ) {}

  async create(user: User, createTimeEntryDto: CreateTimeEntryDto) {
    const { startTime, endTime, taskId } = createTimeEntryDto;

    if (endTime) {
      ensureEndTimeAfterStartTime(startTime, endTime);
    } else {
      const activeEntry = await this.getActiveTimeEntry(user._id.toString());
      if (activeEntry)
        throw new BadRequestException('You already have an active time entry');
    }

    if (taskId) await this.ensureTaskExists(taskId);

    const newEntry = await this.timeEntryModel.create({
      userId: user._id,
      ...createTimeEntryDto,
    });

    return {
      success: true,
      message: 'Time entry successfully created',
      data: { timeEntry: newEntry },
    };
  }

  async findAll(user: User, query: FindAllTimeEntriesQueryDto) {
    let mongoQuery = this.timeEntryModel.find({ userId: user._id });

    const allowedFields = Object.keys(this.timeEntryModel.schema.paths);
    mongoQuery = applySort(mongoQuery, query, allowedFields);
    mongoQuery = applySelectFields(mongoQuery, query, allowedFields);
    mongoQuery = applyPagination(mongoQuery, query);
    mongoQuery = applyQueryFilter(mongoQuery, query);

    const timeEntries = await mongoQuery;

    return {
      success: true,
      message: 'Time entries successfully retrieved',
      results: timeEntries.length,
      data: { timeEntries },
    };
  }

  async findOne(user: User, id: string) {
    const timeEntry = await this.getTimeEntryOrFail(user, id);

    return {
      success: true,
      message: 'Time entry successfully retrieved',
      data: { timeEntry },
    };
  }

  async update(user: User, id: string, updateTimeEntryDto: UpdateTimeEntryDto) {
    const { startTime: newStartTime, endTime: newEndTime } = updateTimeEntryDto;

    const timeEntry = await this.getTimeEntryOrFail(user, id);

    const startTime = newStartTime || timeEntry.startTime;
    const endTime = newEndTime || timeEntry.endTime;

    if ((newEndTime || newStartTime) && endTime)
      ensureEndTimeAfterStartTime(startTime, endTime);

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

  async remove(user: User, id: string) {
    const timeEntry = await this.getTimeEntryOrFail(user, id);

    await timeEntry.deleteOne();

    return {
      success: true,
      message: 'Time entry successfully deleted',
      data: null,
    };
  }

  private async getTimeEntryOrFail(user: User, timeEntryId: string) {
    const timeEntry = await this.timeEntryModel.findOne({
      _id: new Types.ObjectId(timeEntryId),
      userId: user._id,
    });

    if (!timeEntry) throw new NotFoundException('Time entry not found');

    return timeEntry;
  }

  private async getActiveTimeEntry(userId: string) {
    const activeEntry = await this.timeEntryModel.findOne({
      userId: new Types.ObjectId(userId),
      isActive: true,
    });

    return activeEntry;
  }

  private async ensureTaskExists(taskId: string) {
    const task = await this.taskModel.findById(taskId);

    if (!task)
      throw new BadRequestException('The specified task does not exist');
  }
}
