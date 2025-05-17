import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

type TaskDocument = HydratedDocument<Task>;

/* eslint-disable */
export interface TaskModelType extends Model<TaskDocument> {}
/* eslint-enable */

@Schema()
export class Task {
  readonly _id: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  isMain: boolean;

  @Prop({ required: false, default: null })
  estimation: number;

  @Prop({ required: false, default: false })
  isCompleted: boolean;

  @Prop({ required: false, default: Date.now })
  createdAt: Date;
}

const TaskSchema = SchemaFactory.createForClass(Task);

export { TaskSchema };
