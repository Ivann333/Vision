import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from './paginationQuery.dto';

export class FindAllQueryDto extends IntersectionType(PaginationQueryDto) {}
