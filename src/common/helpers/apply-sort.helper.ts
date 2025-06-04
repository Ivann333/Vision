import { Query } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { BaseFindAllQueryDto } from '../dto/base-find-all-query.dto';

export function applySort<T>(
  query: Query<T[], T>,
  queryDto: BaseFindAllQueryDto,
  allowedFields: string[],
) {
  if (!queryDto.sort) return query;
  const sortFields = queryDto.sort.split(',');

  //validation
  for (const field of sortFields) {
    const cleanField = field.startsWith('-') ? field.slice(1) : field;
    if (!allowedFields.includes(cleanField)) {
      throw new BadRequestException(`Invalid sort field: ${field}`);
    }
  }

  return query.sort(sortFields.join(' '));
}
