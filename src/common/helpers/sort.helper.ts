import { Query } from 'mongoose';
import { SortQueryDto } from '../dto/sort-query.dto';
import { BadRequestException } from '@nestjs/common';

export function applySort<T>(
  query: Query<T[], T>,
  sortQueryDto: SortQueryDto,
  allowedFields: string[],
) {
  if (!sortQueryDto.sort) return query;
  const sortFields = sortQueryDto.sort.split(',');

  //validation
  for (const field of sortFields) {
    const cleanField = field.startsWith('-') ? field.slice(1) : field;
    if (!allowedFields.includes(cleanField)) {
      throw new BadRequestException(`Invalid sort field: ${field}`);
    }
  }

  return query.sort(sortFields.join(' '));
}
