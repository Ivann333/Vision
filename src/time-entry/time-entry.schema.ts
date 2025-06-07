import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import * as dayjs from 'dayjs';
import { formatDuration } from 'src/common/helpers/format-duration.helper';

export type TimeEntryDocument = HydratedDocument<TimeEntry>;

/* eslint-disable */
export interface TimeEntryModelType extends Model<TimeEntryDocument> {}
/* eslint-enable */

@Schema({ timestamps: true, id: false })
export class TimeEntry {
  readonly _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Task',
    required: false,
    default: null,
  })
  taskId: Types.ObjectId;

  @Prop({ required: false, default: null })
  description: string;

  @Prop({ required: false })
  isActive: boolean;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: false, default: null })
  duration: number;

  @Prop({ required: false, default: null })
  endTime: Date;
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
  this.isActive = this.endTime ? false : true;
  next();
});

TimeEntrySchema.pre<TimeEntryDocument>('save', function (next) {
  if (!this.isModified('endTime') && !this.isModified('startTime'))
    return next();
  if (this.endTime === null) return next();

  const duration: number = Math.floor(
    (this.endTime.getTime() - this.startTime.getTime()) / 1000,
  );

  this.duration = duration;
  next();
});

export { TimeEntrySchema };
