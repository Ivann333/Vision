import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

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
  endTime: Date;

  @Prop({ required: false, default: Date.now })
  createdAt: Date;
}

const TimeEntrySchema = SchemaFactory.createForClass(TimeEntry);

export default TimeEntrySchema;
