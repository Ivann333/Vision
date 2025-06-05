import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import * as dayjs from 'dayjs';
import { formatDuration } from 'src/common/helpers/format-duration.helper';

type TimeEntryDocument = HydratedDocument<TimeEntry>;

/* eslint-disable */
export interface TimeEntryModelType extends Model<TimeEntryDocument> {}
/* eslint-enable */

@Schema()
export class TimeEntry {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  taskId: string;

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ required: false, default: Date.now })
  startTime: Date;

  @Prop({ required: false, default: null })
  duration: number;

  @Prop({ required: false, default: null })
  endTime: Date;

  @Prop({ required: false, default: Date.now })
  createdAt: Date;
}

const TimeEntrySchema = SchemaFactory.createForClass(TimeEntry);
TimeEntrySchema.set('toJSON', { virtuals: true });
TimeEntrySchema.set('toObject', { virtuals: true });

TimeEntrySchema.virtual('startTimeLocal').get(function () {
  return dayjs(this.startTime).format('YYYY-MM-DD, HH:mm');
});

TimeEntrySchema.virtual('endTimeLocal').get(function () {
  if (this.endTime) return dayjs(this.endTime).format('YYYY-MM-DD, HH:mm');
  else return null;
});

TimeEntrySchema.virtual('formattedDuration').get(function () {
  if (this.duration) return formatDuration(this.duration);
  else return null;
});

TimeEntrySchema.pre<TimeEntryDocument>('save', function (next) {
  if (this.endTime === null) return next();

  const duration: number = Math.floor(
    (this.endTime.getTime() - this.startTime.getTime()) / 1000,
  );

  this.duration = duration;
  next();
});

export { TimeEntrySchema };
