import { Query } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { SelectFieldsQueryDto } from '../dto/select-fields-query.dto';

export function applySelectFields<T>(
  query: Query<T[], T>,
  sortQueryDto: SelectFieldsQueryDto,
  allowedFields: string[],
) {
  if (!sortQueryDto.fields) return query;
  const selectFields = sortQueryDto.fields.split(',');

  //validation
  for (const field of selectFields) {
    const cleanField = field.startsWith('-') ? field.slice(1) : field;
    if (!allowedFields.includes(cleanField)) {
      throw new BadRequestException(`Invalid sort field: ${field}`);
    }
  }

  return query.select(selectFields.join(' '));
}
