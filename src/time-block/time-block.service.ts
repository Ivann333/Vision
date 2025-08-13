import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TimeBlock, TimeBlockModelType } from './time-block.schema';
import { Task, TaskModelType } from 'src/task/task.schema';
import { CreateTimeBlockDto } from './dto/create-time-block.dto';
import { User } from 'src/user/user.schema';
import { FindAllTimeBlocksQueryDto } from './dto/find-all-time-blocks-query.dto';
import { applyPagination } from 'src/common/helpers/apply-pagination.helper';
import { applySort } from 'src/common/helpers/apply-sort.helper';
import { applySelectFields } from 'src/common/helpers/apply-select-fields.helper';
import { applyQueryFilter } from 'src/common/helpers/apply-query-filter.helper';

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
    await this.ensureTaskExists(taskId);
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

  findOne(id: number) {
    return `This action returns a #${id} time block`;
  }

  update(id: number) {
    return `This action updates a #${id} time block`;
  }

  remove(id: number) {
    return `This action removes a #${id} time block`;
  }

  private async ensureTaskExists(taskId: string) {
    const task = await this.taskModel.findById(taskId);

    if (!task)
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
