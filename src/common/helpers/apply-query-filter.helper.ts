import { Query } from 'mongoose';
import { cloneDeep } from 'lodash';

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
