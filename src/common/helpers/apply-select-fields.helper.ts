import { Query } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { BaseFindAllQueryDto } from '../dto/base-find-all-query.dto';

export function applySelectFields<T>(
  query: Query<T[], T>,
  queryDto: BaseFindAllQueryDto,
  allowedFields: string[],
) {
  if (!queryDto.fields) return query;
  const selectFields = queryDto.fields.split(',');

  //validation
  for (const field of selectFields) {
    const cleanField = field.startsWith('-') ? field.slice(1) : field;
    if (!allowedFields.includes(cleanField)) {
      throw new BadRequestException(`Invalid selected field: ${field}`);
    }
  }

  return query.select(selectFields.join(' '));
}
