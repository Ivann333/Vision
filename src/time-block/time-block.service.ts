import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TimeBlock, TimeBlockModelType } from './time-block.schema';
import { Task, TaskModelType } from 'src/task/task.schema';
import { CreateTimeBlockDto } from './dto/create-time-block.dto';
import { User } from 'src/user/user.schema';
import { FindAllTimeBlocksQueryDto } from './dto/find-all-time-blocks-query.dto';
import { applyPagination } from 'src/common/helpers/apply-pagination.helper';
import { applySort } from 'src/common/helpers/apply-sort.helper';
import { applySelectFields } from 'src/common/helpers/apply-select-fields.helper';
import { applyQueryFilter } from 'src/common/helpers/apply-query-filter.helper';
import { UpdateTimeBlockDto } from './dto/update-time-block.dto';

@Injectable()
export class TimeBlockService {
  constructor(
    @InjectModel(TimeBlock.name)
    private readonly timeBlockModel: TimeBlockModelType,
    @InjectModel(Task.name)
    private readonly taskModel: TaskModelType,
  ) {}

  async create(user: User, createTimeBlockDto: CreateTimeBlockDto) {
    const { taskId, startTime, endTime } = createTimeBlockDto;

    this.ensureEndTimeAfterStartTime(startTime, endTime);
    await this.ensureTaskExists(user._id.toString(), taskId);
    await this.ensureNoOverlappingTimeBlock(
      user._id.toString(),
      startTime,
      endTime,
    );

    const newTimeBlock = await this.timeBlockModel.create({
      userId: user._id,
      ...createTimeBlockDto,
    });

    return {
      success: true,
      message: 'Time block successfully created',
      data: { timeBlock: newTimeBlock },
    };
  }

  async findAll(user: User, query: FindAllTimeBlocksQueryDto) {
    let mongoQuery = this.timeBlockModel.find({ userId: user._id });

    const allowedFields = Object.keys(this.timeBlockModel.schema.paths);
    mongoQuery = applySort(mongoQuery, query, allowedFields);
    mongoQuery = applySelectFields(mongoQuery, query, allowedFields);
    mongoQuery = applyPagination(mongoQuery, query);
    mongoQuery = applyQueryFilter(mongoQuery, query);

    const timeBlocks = await mongoQuery;

    return {
      success: true,
      message: 'Time blocks successfully retrieved',
      results: timeBlocks.length,
      data: { timeBlocks },
    };
  }

  async findOne(user: User, id: string) {
    const timeBlock = await this.getTimeBlockOrFail(user, id);

    return {
      success: true,
      message: 'Time block successfully retrieved',
      data: { timeEntry: timeBlock },
    };
  }

  async update(user: User, id: string, updateTimeBlockDto: UpdateTimeBlockDto) {
    const {
      startTime: newStartTime,
      endTime: newEndTime,
      taskId,
    } = updateTimeBlockDto;

    const timeBlock = await this.getTimeBlockOrFail(user, id);

    const startTime = newStartTime || timeBlock.startTime;
    const endTime = newEndTime || timeBlock.endTime;

    if ((newEndTime || newStartTime) && endTime)
      this.ensureEndTimeAfterStartTime(startTime, endTime);

    if (taskId) await this.ensureTaskExists(user._id.toString(), taskId);

    for (const [key, value] of Object.entries(updateTimeBlockDto)) {
      if (value) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timeBlock[key] = value;
      }
    }

    const updatedTimeBlock = await timeBlock.save();

    return {
      success: true,
      message: 'Time entry successfully updated',
      data: { timeBlock: updatedTimeBlock },
    };
  }

  private async getTimeBlockOrFail(user: User, timeBlockId: string) {
    const timeBlock = await this.timeBlockModel.findOne({
      _id: new Types.ObjectId(timeBlockId),
      userId: user._id,
    });

    if (!timeBlock) throw new NotFoundException('Time block not found');

    return timeBlock;
  }

  private async ensureTaskExists(userId: string, taskId: string) {
    const task = await this.taskModel.find({
      _id: taskId,
      userId: new Types.ObjectId(userId),
    });

    console.log({ task });

    if (!task || task.length === 0)
      throw new BadRequestException('The specified task does not exist');
  }

  private ensureEndTimeAfterStartTime(
    startTime: string | Date,
    endTime: string | Date,
  ) {
    const endTimeDate = new Date(endTime);
    const startTimeDate = new Date(startTime);

    if (endTimeDate <= startTimeDate)
      throw new BadRequestException('endTime must be after startTime');
  }

  private async ensureNoOverlappingTimeBlock(
    userId: string,
    startTime: Date | string,
    endTime: Date | string,
  ) {
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);

    const overlappingBlocks = await this.timeBlockModel.find({
      userId: new Types.ObjectId(userId),
      startTime: { $lte: endTimeDate },
      endTime: { $gte: startTimeDate },
    });

    if (overlappingBlocks.length > 0) {
      const blocksInfo = overlappingBlocks
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        .map(
          (block) =>
            `${block.startTime.toISOString()} - ${block.endTime.toISOString()}`,
        )
        .join('; ');

      throw new BadRequestException(
        `You already have time blocks: ${blocksInfo}.`,
      );
    }
  }
}
