import { PaginationQueryDto } from '../dto/paginationQuery.dto';
import { Query } from 'mongoose';

export function applyPagination<T>(
  query: Query<T[], T>,
  paginationDto: PaginationQueryDto,
) {
  const page = paginationDto.page || 1;
  const limit = paginationDto.limit || 10;
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
}
