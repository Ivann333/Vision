import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  BooleanFilterDto,
  DateFilterDto,
  NumberFilterDto,
} from 'src/common/dto/filters.dto';
import { BaseFindAllQueryDto } from 'src/common/dto/base-find-all-query.dto';
import { IntersectionType } from '@nestjs/swagger';

class TimeEntryQueryFiltersDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => BooleanFilterDto)
  isActive?: BooleanFilterDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateFilterDto)
  startTime?: DateFilterDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => NumberFilterDto)
  duration?: NumberFilterDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateFilterDto)
  endTime?: DateFilterDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateFilterDto)
  createdAt?: DateFilterDto;
}

export class FindAllTimeEntriesQueryDto extends IntersectionType(
  BaseFindAllQueryDto,
  TimeEntryQueryFiltersDto,
) {}
