import { Query } from 'mongoose';
import { BaseFindAllQueryDto } from '../dto/base-find-all-query.dto';

export function applyPagination<T>(
  query: Query<T[], T>,
  queryDto: BaseFindAllQueryDto,
) {
  const page = queryDto.page || 1;
  const limit = queryDto.limit || 10;
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
}
