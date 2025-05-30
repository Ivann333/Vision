import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindAllTasksQueryDto extends IntersectionType(
  PaginationQueryDto,
) {}
