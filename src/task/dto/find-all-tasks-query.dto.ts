import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { SortQueryDto } from 'src/common/dto/sort-query.dto';
import { SelectFieldsQueryDto } from 'src/common/dto/select-fields-query.dto';

export class FindAllTasksQueryDto extends IntersectionType(
  PaginationQueryDto,
  SortQueryDto,
  SelectFieldsQueryDto,
) {}
