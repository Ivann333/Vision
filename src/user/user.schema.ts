import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

type UserDocument = HydratedDocument<User>;

export interface UserModelType extends Model<UserDocument> {
  validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

@Schema({ timestamps: true, id: false })
export class User {
  readonly _id: Types.ObjectId;
  readonly createdAt: Date;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;

  next();
});

UserSchema.statics.validatePassword = async function (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export { UserSchema };
