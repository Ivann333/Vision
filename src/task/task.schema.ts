import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { TaskType } from './enums/task-type.enum';

export type TaskDocument = HydratedDocument<Task>;

export interface TaskModelType extends Model<TaskDocument> {
  calculateEndDate(startDate: Date, type: TaskType): Date;
}

@Schema({ timestamps: true, id: false })
export class Task {
  readonly _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: Object.values(TaskType),
  })
  type: TaskType;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: false })
  endDate: Date;

  @Prop({ required: false, default: null })
  estimation: number;

  @Prop({ required: false, default: false })
  isCompleted: boolean;
}

const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.statics.calculateEndDate = function (
  startDate: Date,
  type: string,
): Date {
  const endDate = new Date(startDate);

  if (type === 'Annual') {
    endDate.setFullYear(startDate.getFullYear() + 1);
  }
  if (type === 'Monthly') {
    endDate.setMonth(startDate.getMonth() + 1);
  }
  if (type === 'Weekly') {
    endDate.setDate(endDate.getDate() + 6);
  }
  if (type === 'Daily') {
    // No change needed; endDate is same as startDate
  }
  return endDate;
};

TaskSchema.pre<TaskDocument>('save', function (next) {
  const model = this.constructor as TaskModelType;
  this.endDate = model.calculateEndDate(this.startDate, this.type);
  next();
});

export { TaskSchema };
