import { Query } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { BaseFindAllQueryDto } from '../dto/base-find-all-query.dto';

// Pagination
export function applyPagination<T>(
  query: Query<T[], T>,
  queryDto: BaseFindAllQueryDto,
) {
  const page = queryDto.page || 1;
  const limit = queryDto.limit || 10;
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
}

// Sorting
export function applySort<T>(
  query: Query<T[], T>,
  queryDto: BaseFindAllQueryDto,
  allowedFields: string[],
) {
  if (!queryDto.sort) return query;
  const sortFields = queryDto.sort.split(',');

  for (const field of sortFields) {
    const cleanField = field.startsWith('-') ? field.slice(1) : field;
    if (!allowedFields.includes(cleanField)) {
      throw new BadRequestException(`Invalid sort field: ${field}`);
    }
  }

  return query.sort(sortFields.join(' '));
}

// Field Selection
export function applySelectFields<T>(
  query: Query<T[], T>,
  queryDto: BaseFindAllQueryDto,
  allowedFields: string[],
) {
  if (!queryDto.fields) return query;
  const selectFields = queryDto.fields.split(',');

  for (const field of selectFields) {
    const cleanField = field.startsWith('-') ? field.slice(1) : field;
    if (!allowedFields.includes(cleanField)) {
      throw new BadRequestException(`Invalid selected field: ${field}`);
    }
  }

  return query.select(selectFields.join(' '));
}

// Query Filtering
export function applyQueryFilter<T>(
  query: Query<T[], T>,
  queryObj: Record<string, any>,
) {
  const exclude = ['page', 'sort', 'limit', 'fields'];

  const mongoQueryObj = cloneDeep(queryObj);
  exclude.forEach((item) => delete mongoQueryObj[item]);

  let mongoQueryString = JSON.stringify(mongoQueryObj);

  mongoQueryString = mongoQueryString
    .replaceAll('"gte"', '"$gte"')
    .replaceAll('"gt"', '"$gt"')
    .replaceAll('"lte"', '"$lte"')
    .replaceAll('"lt"', '"$lt"')
    .replaceAll('"eq"', '"$eq"')
    .replaceAll('"ne"', '"$ne"');

  return query.find(JSON.parse(mongoQueryString));
}
