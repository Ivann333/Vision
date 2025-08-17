import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

export async function getDocumentOrFail<T>(
  model: Model<T>,
  filter: Record<string, any>,
  notFoundMessage = 'Document not found',
) {
  const document = await model.findOne(filter).exec();

  if (!document) throw new NotFoundException(notFoundMessage);

  return document;
}
