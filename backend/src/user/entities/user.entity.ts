import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

export interface IUser {
  name: string;
  email: string;
  password: string;
  university?: string;
  address?: string;
}

@Schema({ timestamps: true, autoCreate: true, collection: 'users' })
export class User implements IUser {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  university?: string;

  @Prop()
  address?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// pre-save hook to hash password
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
