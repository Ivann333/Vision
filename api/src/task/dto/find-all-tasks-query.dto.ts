import { IntersectionType } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  BooleanFilterDto,
  DateFilterDto,
  NumberFilterDto,
  StringFilterDto,
  TaskTypeFilterDto,
} from 'src/common/dto/filters.dto';

import { BaseFindAllQueryDto } from 'src/common/dto/base-find-all-query.dto';

class TaskQueryFiltersDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => StringFilterDto)
  name?: StringFilterDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TaskTypeFilterDto)
  type?: TaskTypeFilterDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateFilterDto)
  startDate?: DateFilterDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateFilterDto)
  endDate?: DateFilterDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => NumberFilterDto)
  estimation?: NumberFilterDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BooleanFilterDto)
  isCompleted?: BooleanFilterDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateFilterDto)
  createdAt?: DateFilterDto;
}

export class FindAllTasksQueryDto extends IntersectionType(
  BaseFindAllQueryDto,
  TaskQueryFiltersDto,
) {}
