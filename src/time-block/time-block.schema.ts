import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

type TimeBlockDocument = HydratedDocument<TimeBlock>;

/* eslint-disable */
export interface TimeBlockModelType extends Model<TimeBlockDocument> {}
/* eslint-enable */

@Schema({ timestamps: true, id: false })
export class TimeBlock {
  readonly _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
  taskId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: false, default: null })
  description: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: false })
  duration: number;

  @Prop({ required: true })
  endTime: Date;
}

const TimeBlockSchema = SchemaFactory.createForClass(TimeBlock);

TimeBlockSchema.pre('save', function (next) {
  if (!this.isModified('endTime') && !this.isModified('startTime'))
    return next();

  const duration: number = Math.floor(
    (this.endTime.getTime() - this.startTime.getTime()) / 1000,
  );

  this.duration = duration;
  next();
});

export { TimeBlockSchema };
