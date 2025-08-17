import { IntersectionType } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DateFilterDto, NumberFilterDto } from 'src/common/dto/filters.dto';

import { BaseFindAllQueryDto } from 'src/common/dto/base-find-all-query.dto';

class TimeBlockQueryFiltersDto {
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
}

export class FindAllTimeBlocksQueryDto extends IntersectionType(
  BaseFindAllQueryDto,
  TimeBlockQueryFiltersDto,
) {}
